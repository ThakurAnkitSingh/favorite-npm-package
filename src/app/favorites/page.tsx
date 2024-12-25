"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FavoritesTable from "../components/FavoritesTable";
import Button from "@mui/material/Button";
import { toast } from 'react-toastify';


interface Favorite {
  name: string;
  reason: string;
}

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
        setFavorites([]);
      }
    }
  }, []);

  const handleRemoveFavorite = (favorite: Favorite) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.filter((fav) => fav.name !== favorite.name);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
    console.log(favorite, "Favorites")
    toast.success(`${favorite?.name} has been removed from favorites!`);
  };

  const handleEditFavorite = (name: string, newReason: string) => {
    const favoriteToEdit = favorites.find(fav => fav.name === name);
    
    if (favoriteToEdit) {
      if (favoriteToEdit.reason === newReason) {
        toast.warn("You haven't updated the reason.");
        return;
      }
      
      const newFavorites = favorites.map(fav => 
        fav.name === name ? { ...fav, reason: newReason } : fav
      );
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      toast.success(`Favorite reason for ${name} has been updated!`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Favorite NPM Packages</h1>
      <FavoritesTable 
        favorites={favorites} 
        onRemoveFavorite={handleRemoveFavorite}
        onEditFavorite={handleEditFavorite}
      />
      <Button
        variant="outlined"
        className="mt-4"
        onClick={() => router.push("/")}
      >
        Back to Search
      </Button>
    </div>
  );
};

export default FavoritesPage;