// Admin Panel for Content Management
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Trash2, Plus, Edit, Save, X, Upload, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import type { Race, Class, Spell, Item, Feat, Background, Edition, Source } from "../types/dnd-types";

type EntityType = "races" | "classes" | "spells" | "items" | "feats" | "backgrounds" | "monsters";

interface AdminPanelProps {
  onImportData: (data: any, type: EntityType) => void;
  onExportData: (type: EntityType) => void;
}

export function AdminPanel({ onImportData, onExportData }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<EntityType>("races");
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-amber-900 mb-2">Content Management System</h1>
          <p className="text-neutral-600">
            Add, edit, and manage all D&D content. Import SRD data or create your own homebrew content.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EntityType)} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="races">Races</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="spells">Spells</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="feats">Feats</TabsTrigger>
            <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
            <TabsTrigger value="monsters">Monsters</TabsTrigger>
          </TabsList>

          {/* Import/Export Actions */}
          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".json";
                input.onchange = (e: any) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const data = JSON.parse(event.target?.result as string);
                      onImportData(data, activeTab);
                    } catch (error) {
                      alert("Error parsing JSON file");
                    }
                  };
                  reader.readAsText(file);
                };
                input.click();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import JSON
            </Button>
            <Button
              variant="outline"
              onClick={() => onExportData(activeTab)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>

          {/* Content Tables */}
          <TabsContent value="races" className="space-y-4">
            <RaceManager />
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <ClassManager />
          </TabsContent>

          <TabsContent value="spells" className="space-y-4">
            <SpellManager />
          </TabsContent>

          <TabsContent value="items" className="space-y-4">
            <ItemManager />
          </TabsContent>

          <TabsContent value="feats" className="space-y-4">
            <FeatManager />
          </TabsContent>

          <TabsContent value="backgrounds" className="space-y-4">
            <BackgroundManager />
          </TabsContent>

          <TabsContent value="monsters" className="space-y-4">
            <MonsterManager />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Dialog */}
      <CreateEntityDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        entityType={activeTab}
      />
    </div>
  );
}

// Race Manager Component
function RaceManager() {
  const [races, setRaces] = useState<Race[]>([]);
  const [editingRace, setEditingRace] = useState<Race | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Race Management</CardTitle>
        <CardDescription>Manage playable races and their variants</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {races.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <p>No races added yet. Click "Create New" to add your first race.</p>
                <p className="text-sm mt-2">Or import from JSON to bulk load SRD content.</p>
              </div>
            ) : (
              races.map((race) => (
                <RaceCard key={race.id} race={race} onEdit={setEditingRace} onDelete={() => {}} />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function RaceCard({ race, onEdit, onDelete }: { race: Race; onEdit: (race: Race) => void; onDelete: () => void }) {
  return (
    <div className="border rounded-lg p-4 hover:border-amber-400 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-amber-900">{race.name}</h3>
            <Badge variant={race.source === "Official" ? "default" : "secondary"}>
              {race.source}
            </Badge>
            <Badge variant="outline">{race.edition}</Badge>
          </div>
          <p className="text-sm text-neutral-600 mb-2">{race.description}</p>
          <div className="flex gap-2 text-sm">
            <span className="text-neutral-500">Size: {race.size}</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-500">Speed: {race.speed} ft.</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(race)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Class Manager Component
function ClassManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Management</CardTitle>
        <CardDescription>Manage character classes and subclasses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-neutral-500">
          <p>No classes added yet. Click "Create New" to add your first class.</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Spell Manager Component
function SpellManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spell Management</CardTitle>
        <CardDescription>Manage spells across all levels and schools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-neutral-500">
          <p>No spells added yet. Click "Create New" to add your first spell.</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Item Manager Component
function ItemManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Management</CardTitle>
        <CardDescription>Manage weapons, armor, and magical items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-neutral-500">
          <p>No items added yet. Click "Create New" to add your first item.</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Feat Manager Component
function FeatManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feat Management</CardTitle>
        <CardDescription>Manage character feats and special abilities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-neutral-500">
          <p>No feats added yet. Click "Create New" to add your first feat.</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Background Manager Component
function BackgroundManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Background Management</CardTitle>
        <CardDescription>Manage character backgrounds and their features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-neutral-500">
          <p>No backgrounds added yet. Click "Create New" to add your first background.</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Monster Manager Component
function MonsterManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monster Management</CardTitle>
        <CardDescription>Manage creatures and their stat blocks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-neutral-500">
          <p>No monsters added yet. Click "Create New" to add your first monster.</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Create Entity Dialog
interface CreateEntityDialogProps {
  open: boolean;
  onClose: () => void;
  entityType: EntityType;
}

function CreateEntityDialog({ open, onClose, entityType }: CreateEntityDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    source: "Homebrew" as Source,
    edition: "Both" as Edition
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New {entityType.slice(0, -1).charAt(0).toUpperCase() + entityType.slice(1, -1)}</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new {entityType.slice(0, -1)} entry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={`Enter ${entityType.slice(0, -1)} name`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter detailed description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select
                value={formData.source}
                onValueChange={(value: Source) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Official">Official</SelectItem>
                  <SelectItem value="Homebrew">Homebrew</SelectItem>
                  <SelectItem value="Unofficial">Unofficial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edition">Edition</Label>
              <Select
                value={formData.edition}
                onValueChange={(value: Edition) => setFormData({ ...formData, edition: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2014">2014</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Entity-specific fields would go here */}
          {entityType === "races" && <RaceSpecificFields />}
          {entityType === "spells" && <SpellSpecificFields />}
          {entityType === "items" && <ItemSpecificFields />}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={() => {
            // Save logic here
            onClose();
          }}>
            <Save className="w-4 h-4 mr-2" />
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Entity-specific form fields
function RaceSpecificFields() {
  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="text-sm text-neutral-700">Race-Specific Fields</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Size</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tiny">Tiny</SelectItem>
              <SelectItem value="Small">Small</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Speed (ft.)</Label>
          <Input type="number" placeholder="30" />
        </div>
      </div>
    </div>
  );
}

function SpellSpecificFields() {
  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="text-sm text-neutral-700">Spell-Specific Fields</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Level</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Cantrip</SelectItem>
              <SelectItem value="1">1st Level</SelectItem>
              <SelectItem value="2">2nd Level</SelectItem>
              <SelectItem value="3">3rd Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>School</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select school" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Evocation">Evocation</SelectItem>
              <SelectItem value="Abjuration">Abjuration</SelectItem>
              <SelectItem value="Conjuration">Conjuration</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function ItemSpecificFields() {
  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="text-sm text-neutral-700">Item-Specific Fields</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weapon">Weapon</SelectItem>
              <SelectItem value="Armor">Armor</SelectItem>
              <SelectItem value="Potion">Potion</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Rarity</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Common">Common</SelectItem>
              <SelectItem value="Uncommon">Uncommon</SelectItem>
              <SelectItem value="Rare">Rare</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
