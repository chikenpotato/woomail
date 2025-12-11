import { useState } from 'react';
import Header from '@/components/layout/Header';
import DocumentCard from '@/components/vault/DocumentCard';
import { mockAttachments, mockCategoryCounts } from '@/data/mockData';
import { EmailCategory } from '@/types';
import { categoryConfig, formatFileSize } from '@/lib/categoryUtils';
import { cn } from '@/lib/utils';
import { FolderOpen, FileText, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Vault = () => {
  const [selectedCategory, setSelectedCategory] = useState<EmailCategory | null>(null);

  const filteredDocs = selectedCategory
    ? mockAttachments.filter(d => d.category === selectedCategory)
    : mockAttachments;

  const totalSize = mockAttachments.reduce((acc, doc) => acc + doc.fileSize, 0);

  const categories = Object.entries(categoryConfig) as [EmailCategory, typeof categoryConfig[EmailCategory]][];
  const categoryDocs = categories.map(([key]) => ({
    category: key,
    count: mockAttachments.filter(d => d.category === key).length,
  })).filter(c => c.count > 0);

  return (
    <div className="min-h-screen">
      <Header 
        title="Document Vault" 
        subtitle={`${mockAttachments.length} documents • ${formatFileSize(totalSize)} total`}
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search documents..." 
              className="pl-9 bg-muted/50 border-border/50"
            />
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <FolderOpen className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Categories</h2>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full flex items-center justify-between p-2.5 rounded-lg transition-colors text-left",
                    selectedCategory === null 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>All Documents</span>
                  </div>
                  <span className="text-sm">{mockAttachments.length}</span>
                </button>

                {categoryDocs.map(({ category, count }) => {
                  const config = categoryConfig[category];
                  const Icon = config.icon;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 rounded-lg transition-colors text-left",
                        selectedCategory === category 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-accent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                        <span>{config.label}</span>
                      </div>
                      <span className="text-sm">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="lg:col-span-3">
            <div className="grid gap-4">
              {filteredDocs.map((doc, index) => (
                <div 
                  key={doc.id}
                  className="animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <DocumentCard document={doc} />
                </div>
              ))}
            </div>

            {filteredDocs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No documents in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vault;
