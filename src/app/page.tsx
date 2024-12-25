"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert } from "@mui/material";
import { Typography, Paper } from "@mui/material";
import AddFavoriteModal from "./components/AddFavoriteModal";
import { toast } from 'react-toastify'; 


interface Package {
  name: string;
  version: string;
  description: string;
}

interface Favorite {
  name: string;
  reason: string;
}

interface NpmPackageResponse {
  objects: {
    package: Package;
  }[];
}

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const resultsPerPage = 12;
  const observer = useRef<IntersectionObserver | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a package name to search.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get<NpmPackageResponse>(
        `https://registry.npmjs.org/-/v1/search?text=${searchQuery}&size=${resultsPerPage}&from=${page * resultsPerPage}`
      );
      if (response?.data?.objects?.length === 0) {
        toast.warn("No packages found for your search."); 
      }
      setResults(response?.data?.objects?.map((obj: { package: Package }) => obj.package));
      setPage(1);
    } catch (err) {
      console.log(err, "Error in handle Search");
      toast.error("An error occurred while fetching packages.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnterSearch = () => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      toast.error("Please enter a package name to search.");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleEnterSearch();
    }
  };

  const handleAddToFavorites = (pkg: Package) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedPackage(null);
  };

  const handleAddFavorite = (favorite: { name: string; reason: string }) => {
    const { name, reason } = favorite;
    const newFavorite = { name, reason };
    const storedFavorites = localStorage.getItem("favorites");
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (!favorites.some((fav: Favorite) => fav.name === newFavorite.name)) {
      favorites.push(newFavorite);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      toast.success(`${name} has been added to favorites!`);
    } else {
      toast.error(`${name} has not been added to favorites!`);
    }
  };

  const fetchMoreResults = useCallback(async () => {
    if (loading || !searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get<NpmPackageResponse>(
        `https://registry.npmjs.org/-/v1/search?text=${searchQuery}&size=${resultsPerPage}&from=${page * resultsPerPage}`
      );
      setResults((prevResults) => [...prevResults, ...response?.data?.objects?.map((obj: { package: Package }) => obj?.package)]);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.log(err, "Error in fetching more results");
      toast.error("An error occurred while fetching more packages.");
    } finally {
      setLoading(false);
    }
  }, [loading, searchQuery, page, resultsPerPage]);

  useEffect(() => {
    const loadMore = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        fetchMoreResults();
      }
    };

    observer.current = new IntersectionObserver(loadMore);
    const lastResult = document.querySelector("#last-result");
    if (lastResult) {
      observer.current.observe(lastResult);
    }

    return () => {
      if (observer.current && lastResult) {
        observer.current.unobserve(lastResult);
      }
    };
  }, [results, fetchMoreResults]);

  return (
    <div style={{ width: '100%', padding: '2rem', backgroundColor: '#f5f5f5' }}>
      <Paper elevation={3} style={{ padding: '2rem', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" style={{ color: '#333' }}>
            Search NPM Packages
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: 'black',
              borderColor: '#000',
              '&:hover': {
                backgroundColor: '#2e7d32',
                color: 'white',
                borderColor: '#2e7d32'
              },
            }}
            onClick={() => router.push('/favorites')}
          >
            View Favorites
          </Button>
        </div>
        <TextField
          label="Search NPM Packages"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="contained"
          color="primary"
          className="mt-2"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Search"}
        </Button>
        {error && <Alert severity="error" className="mt-2">{error}</Alert>}
        {results.length > 0 && (
          <div className="mt-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {results.map((pkg, index) => (
              <div key={index} className="p-4 border rounded-lg shadow hover:shadow-lg" style={{ flex: '1 1 calc(33.333% - 16px)', boxSizing: 'border-box', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} id={index === results.length - 1 ? "last-result" : undefined}>
                <div>
                  <h3 className="font-bold text-lg">{pkg.name}</h3>
                  <p className="text-gray-600" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {pkg.description}
                  </p>
                </div>
                <Button
                  variant="outlined"
                  className="mt-2"
                  onClick={() => handleAddToFavorites(pkg)}
                >
                  Add to Favorites
                </Button>
              </div>
            ))}
            {loading && <CircularProgress className="mt-4" />}
          </div>
        )}
      </Paper>
      <AddFavoriteModal 
        open={modalOpen} 
        onClose={handleModalClose} 
        onSave={handleAddFavorite} 
        selectedPackage={selectedPackage}
      />
    </div>
  );
};

export default HomePage;