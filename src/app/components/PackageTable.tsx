"use client";

import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

interface Package {
  name: string;
  description: string;
  version: string;
}

interface PackageTableProps {
  packages: Package[];
  onAddToFavorites: (pkg: Package) => void;
}

const PackageTable: React.FC<PackageTableProps> = ({ packages, onAddToFavorites }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Package Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {packages.map((pkg) => (
            <TableRow key={pkg.name}>
              <TableCell>{pkg.name}</TableCell>
              <TableCell>{pkg.description || "No description"}</TableCell>
              <TableCell>{pkg.version}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onAddToFavorites(pkg)}
                >
                  Add to Favorites
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PackageTable; 