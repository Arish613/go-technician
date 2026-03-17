"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import type { City, Locality } from "@/types/location";
import Link from "next/link";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminLocationsPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  const [localityDialogOpen, setLocalityDialogOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  const [cityForm, setCityForm] = useState({ name: "", slug: "", isActive: true });
  const [localityForm, setLocalityForm] = useState({ name: "", slug: "", cityId: "", isActive: true });

  const fetchCities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cities");
      const result = await response.json();
      if (response.ok && result.data) {
        setCities(result.data);
      } else {
        setError(result.error || "Failed to fetch cities");
      }
    } catch (err) {
      setError("An error occurred while fetching cities");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocalities = async (cityId?: string) => {
    try {
      const url = cityId ? `/api/localities?cityId=${cityId}` : "/api/localities";
      const response = await fetch(url);
      const result = await response.json();
      if (response.ok && result.data) {
        setLocalities(result.data);
      }
    } catch (err) {
      console.error("Error fetching localities:", err);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchLocalities();
  }, []);

  const handleCreateCity = async () => {
    try {
      const response = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cityForm),
      });
      if (response.ok) {
        setCityForm({ name: "", slug: "", isActive: true });
        setCityDialogOpen(false);
        fetchCities();
      }
    } catch (err) {
      console.error("Error creating city:", err);
    }
  };

  const handleUpdateCity = async (id: string, isActive: boolean) => {
    try {
      const city = cities.find((c) => c.id === id);
      if (!city) return;
      await fetch(`/api/cities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...city, isActive }),
      });
      fetchCities();
    } catch (err) {
      console.error("Error updating city:", err);
    }
  };

  const handleDeleteCity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this city?")) return;
    try {
      await fetch(`/api/cities/${id}`, { method: "DELETE" });
      fetchCities();
    } catch (err) {
      console.error("Error deleting city:", err);
    }
  };

  const handleCreateLocality = async () => {
    try {
      const response = await fetch("/api/localities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localityForm),
      });
      if (response.ok) {
        setLocalityForm({ name: "", slug: "", cityId: "", isActive: true });
        setLocalityDialogOpen(false);
        fetchLocalities();
      }
    } catch (err) {
      console.error("Error creating locality:", err);
    }
  };

  const handleUpdateLocality = async (id: string, isActive: boolean) => {
    try {
      const locality = localities.find((l) => l.id === id);
      if (!locality) return;
      await fetch(`/api/localities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...locality, isActive }),
      });
      fetchLocalities();
    } catch (err) {
      console.error("Error updating locality:", err);
    }
  };

  const handleDeleteLocality = async (id: string) => {
    if (!confirm("Are you sure you want to delete this locality?")) return;
    try {
      await fetch(`/api/localities/${id}`, { method: "DELETE" });
      fetchLocalities();
    } catch (err) {
      console.error("Error deleting locality:", err);
    }
  };

  const openLocalityDialog = (cityId: string) => {
    setSelectedCityId(cityId);
    setLocalityForm({ name: "", slug: "", cityId, isActive: true });
    setLocalityDialogOpen(true);
  };

  return (
    <div className="md:mx-20 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Locations</h1>
          <p className="text-muted-foreground mt-1">
            Add cities and their localities (e.g., Mumbai → Thane West, Mumbra)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => { fetchCities(); fetchLocalities(); }} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Dialog open={cityDialogOpen} onOpenChange={setCityDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add City
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New City</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">City Name</label>
                  <Input
                    value={cityForm.name}
                    onChange={(e) => setCityForm({ ...cityForm, name: e.target.value, slug: slugify(e.target.value) })}
                    placeholder="e.g., Mumbai"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Slug</label>
                  <Input value={cityForm.slug} onChange={(e) => setCityForm({ ...cityForm, slug: e.target.value })} placeholder="mumbai" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={cityForm.isActive} onCheckedChange={(checked) => setCityForm({ ...cityForm, isActive: checked })} />
                  <span className="text-sm">Active</span>
                </div>
                <Button onClick={handleCreateCity} className="w-full">Create City</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchCities} className="mt-4" variant="outline">Try Again</Button>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Cities</h2>
            {cities.length === 0 ? (
              <p className="text-muted-foreground">No cities found. Add your first city above.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Localities</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell className="font-medium">{city.name}</TableCell>
                      <TableCell><Badge variant="secondary">{city.slug}</Badge></TableCell>
                      <TableCell>
                        <Link href="#" onClick={() => openLocalityDialog(city.id)} className="text-blue-600 hover:underline">
                          Manage ({localities.filter((l) => l.cityId === city.id).length})
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Switch checked={city.isActive} onCheckedChange={(checked) => handleUpdateCity(city.id, checked)} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleDeleteCity(city.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">All Localities</h2>
            {localities.length === 0 ? (
              <p className="text-muted-foreground">No localities found. Add localities from a city&apos;s row.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Locality Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localities.map((locality) => (
                    <TableRow key={locality.id}>
                      <TableCell className="font-medium">{locality.name}</TableCell>
                      <TableCell><Badge variant="secondary">{locality.slug}</Badge></TableCell>
                      <TableCell>{cities.find((c) => c.id === locality.cityId)?.name || "Unknown"}</TableCell>
                      <TableCell>
                        <Switch checked={locality.isActive} onCheckedChange={(checked) => handleUpdateLocality(locality.id, checked)} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteLocality(locality.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}

      <Dialog open={localityDialogOpen} onOpenChange={setLocalityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Locality to {cities.find((c) => c.id === selectedCityId)?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Locality Name</label>
              <Input
                value={localityForm.name}
                onChange={(e) => setLocalityForm({ ...localityForm, name: e.target.value, slug: slugify(e.target.value) })}
                placeholder="e.g., Thane West"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input value={localityForm.slug} onChange={(e) => setLocalityForm({ ...localityForm, slug: e.target.value })} placeholder="thane-west" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={localityForm.isActive} onCheckedChange={(checked) => setLocalityForm({ ...localityForm, isActive: checked })} />
              <span className="text-sm">Active</span>
            </div>
            <Button onClick={handleCreateLocality} className="w-full">Create Locality</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
