import { useState } from 'react';
import { Download, Upload, Loader2, Database, Check, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BackupPanelProps {
  business: any;
  toast: any;
}

const BackupPanel = ({ business, toast }: BackupPanelProps) => {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const handleExport = async () => {
    if (!business) { toast({ title: 'No business found', variant: 'destructive' }); return; }
    setExporting(true);
    try {
      const [products, customers, invoices, invoiceItems, expenses, offers, creditLedger, reviews, storeMedia, storeContent] = await Promise.all([
        supabase.from('products').select('*').eq('business_id', business.id),
        supabase.from('customers').select('*').eq('business_id', business.id),
        supabase.from('invoices').select('*').eq('business_id', business.id),
        supabase.from('invoice_items').select('*, invoices!inner(business_id)').eq('invoices.business_id', business.id),
        supabase.from('expenses').select('*').eq('business_id', business.id),
        supabase.from('business_offers').select('*').eq('business_id', business.id),
        supabase.from('credit_ledger').select('*').eq('business_id', business.id),
        supabase.from('product_reviews').select('*').eq('business_id', business.id),
        supabase.from('store_media').select('*').eq('business_id', business.id),
        supabase.from('store_content').select('*').eq('business_id', business.id),
      ]);

      const backup = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        business_id: business.id,
        business_name: business.business_name,
        data: {
          products: products.data || [],
          customers: customers.data || [],
          invoices: invoices.data || [],
          invoice_items: invoiceItems.data || [],
          expenses: expenses.data || [],
          offers: offers.data || [],
          credit_ledger: creditLedger.data || [],
          reviews: reviews.data || [],
          store_media: storeMedia.data || [],
          store_content: storeContent.data || [],
        },
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ezo-backup-${business.business_name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: 'Backup exported!', description: 'File downloaded successfully.' });
    } catch (err: any) {
      toast({ title: 'Export failed', description: err.message, variant: 'destructive' });
    }
    setExporting(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !business) return;
    setImporting(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      if (!backup.version || !backup.data) {
        throw new Error('Invalid backup file format');
      }

      let imported = 0;

      // Import products
      if (backup.data.products?.length) {
        for (const p of backup.data.products) {
          const { id, created_at, updated_at, business_id, ...rest } = p;
          const { error } = await supabase.from('products').upsert({ ...rest, business_id: business.id, id }, { onConflict: 'id' });
          if (!error) imported++;
        }
      }

      // Import customers
      if (backup.data.customers?.length) {
        for (const c of backup.data.customers) {
          const { id, created_at, updated_at, business_id, ...rest } = c;
          await supabase.from('customers').upsert({ ...rest, business_id: business.id, id }, { onConflict: 'id' });
          imported++;
        }
      }

      // Import expenses
      if (backup.data.expenses?.length) {
        for (const exp of backup.data.expenses) {
          const { id, created_at, updated_at, business_id, ...rest } = exp;
          await supabase.from('expenses').upsert({ ...rest, business_id: business.id, id }, { onConflict: 'id' });
          imported++;
        }
      }

      // Import offers
      if (backup.data.offers?.length) {
        for (const o of backup.data.offers) {
          const { id, created_at, updated_at, business_id, ...rest } = o;
          await supabase.from('business_offers').upsert({ ...rest, business_id: business.id, id }, { onConflict: 'id' });
          imported++;
        }
      }

      setImportResult(`Successfully imported ${imported} records from backup.`);
      toast({ title: 'Import complete!', description: `${imported} records restored.` });
    } catch (err: any) {
      setImportResult(`Error: ${err.message}`);
      toast({ title: 'Import failed', description: err.message, variant: 'destructive' });
    }
    setImporting(false);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Export */}
      <div className="rounded-2xl border border-border p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Export Backup</p>
            <p className="text-xs text-muted-foreground">Download all your business data as a JSON file</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Includes: Products, Customers, Invoices, Expenses, Offers, Credit Ledger, Reviews, Store Media & Content</p>
        <button onClick={handleExport} disabled={exporting}
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? 'Exporting...' : 'Export Data'}
        </button>
      </div>

      {/* Import */}
      <div className="rounded-2xl border border-border p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Upload className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Import Backup</p>
            <p className="text-xs text-muted-foreground">Restore data from a previously exported JSON backup file</p>
          </div>
        </div>
        <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-3">
          <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> This will merge imported data with existing data. Duplicate IDs will be overwritten.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold cursor-pointer hover:bg-muted transition-colors">
          {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {importing ? 'Importing...' : 'Choose File'}
          <input type="file" accept=".json" onChange={handleImport} className="hidden" disabled={importing} />
        </label>
        {importResult && (
          <div className={`rounded-xl p-3 text-xs font-medium ${importResult.startsWith('Error') ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            {importResult.startsWith('Error') ? <AlertTriangle className="w-3.5 h-3.5 inline mr-1" /> : <Check className="w-3.5 h-3.5 inline mr-1" />}
            {importResult}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="rounded-2xl bg-muted/50 p-4">
        <p className="text-xs text-muted-foreground">
          <Database className="w-3.5 h-3.5 inline mr-1" />
          Backups include all business data. Store them safely for disaster recovery. Regular exports are recommended.
        </p>
      </div>
    </div>
  );
};

export default BackupPanel;
