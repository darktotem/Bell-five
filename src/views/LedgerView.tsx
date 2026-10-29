import { useState, type ChangeEvent, type DragEvent } from 'react';
import { Icon, type IconName } from '../components/Icons/Icons';
import { linkableAssets } from '../data/mockAssets';
import { ASSET_TYPE_LABELS, type Asset, type AssetType } from '../types/assets';
import { formatDate, formatKES, formatMultiplier, formatSize } from '../utils/formatters';
import { LIQUIDITY_WEIGHTS, totalValue, weightedLiquidity } from '../utils/scoreCalculator';

interface LedgerViewProps {
  assets: Asset[];
  onLinkAsset: (templateId: string) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'processing' | 'parsed';
}

const TYPE_ICONS: Record<AssetType, IconName> = {
  mobile_money: 'phone',
  mmf: 'trending',
  bank: 'bank',
  sacco: 'users',
  equity: 'chart',
};

const SYNC_OPTIONS: { id: string; label: string; icon: IconName }[] = [
  { id: 'link-bank', label: 'Link bank account', icon: 'bank' },
  { id: 'link-cds', label: 'Link CDS stock account', icon: 'chart' },
  { id: 'link-sacco', label: 'Link SACCO account', icon: 'users' },
];

export default function LedgerView({ assets, onLinkAsset }: LedgerViewProps) {
  const [dragging, setDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const added: UploadedFile[] = Array.from(files).map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      status: 'processing',
    }));
    setUploads((prev) => [...added, ...prev]);
    added.forEach((u) =>
      window.setTimeout(
        () => setUploads((prev) => prev.map((p) => (p.id === u.id ? { ...p, status: 'parsed' } : p))),
        1800,
      ),
    );
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="view">
      <section>
        <div className="section-head"><h2>Upload Statement</h2></div>
        <label
          className={`dropzone ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <input className="sr-only" type="file" multiple accept=".pdf,image/*" onChange={onInput} />
          <span className="dropzone-icon"><Icon name="upload" size={26} /></span>
          <strong>Drop your M-Pesa or bank statement</strong>
          <span className="muted small">PDF or screenshot · tap to browse</span>
        </label>

        {uploads.length > 0 && (
          <div className="list" style={{ marginTop: 12 }}>
            {uploads.map((u) => (
              <div className="list-card" key={u.id}>
                <span className="list-icon"><Icon name="file" size={20} /></span>
                <div className="list-body">
                  <p className="list-title">{u.name}</p>
                  <p className="list-sub">{formatSize(u.size)}</p>
                </div>
                <span className={`pill ${u.status === 'parsed' ? 'pill-green' : 'pill-amber'}`}>
                  {u.status === 'parsed' ? 'Parsed' : 'Processing…'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="section-head"><h2>Quick Sync</h2></div>
        <div className="sync-grid">
          {SYNC_OPTIONS.map((opt) => {
            const linked = assets.some((a) => a.id === opt.id);
            const exists = linkableAssets.some((a) => a.id === opt.id);
            return (
              <button
                key={opt.id}
                className={`sync-btn ${linked ? 'linked' : ''}`}
                disabled={linked || !exists}
                onClick={() => onLinkAsset(opt.id)}
              >
                <Icon name={linked ? 'check' : opt.icon} size={20} />
                <span>{linked ? 'Linked' : opt.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Verified Assets</h2>
          <span className="muted small sensitive">{formatKES(totalValue(assets))}</span>
        </div>
        <div className="list">
          {assets.map((a) => (
            <div className="list-card" key={a.id}>
              <span className="list-icon"><Icon name={TYPE_ICONS[a.type]} size={20} /></span>
              <div className="list-body">
                <p className="list-title">{a.name}</p>
                <p className="list-sub">
                  {ASSET_TYPE_LABELS[a.type]} · Synced {formatDate(a.lastSynced)}
                </p>
              </div>
              <div className="list-end">
                <span className="amount sensitive">{formatKES(a.value)}</span>
                <span className="pill pill-blue">{formatMultiplier(LIQUIDITY_WEIGHTS[a.type])} liquidity</span>
              </div>
            </div>
          ))}
        </div>
        <p className="muted small" style={{ marginTop: 12 }}>
          Liquidity-weighted value: <strong className="sensitive">{formatKES(weightedLiquidity(assets))}</strong>
        </p>
      </section>
    </div>
  );
}