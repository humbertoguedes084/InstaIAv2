
import React, { useState } from 'react';
import { Download, Trash2, Copy, CheckCircle, Image as ImageIcon, Calendar } from 'lucide-react';
import { GeneratedImage } from '../types';

interface GalleryProps {
  history: GeneratedImage[];
  onDelete: (id: string) => void;
  onDownload: (url: string, filename: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ history, onDelete, onDownload }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text?: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="p-4 md:p-8 pb-32 md:pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Galeria do Estúdio</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 bg-gray-100 w-fit px-3 py-1 rounded-full flex items-center gap-2">
            <Calendar size={12} /> Artes expiram em 7 dias
          </p>
        </div>
      </div>

      {history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {history.map((img) => (
            <div key={img.id} className="bg-white rounded-[2.5rem] overflow-hidden border group shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="aspect-[4/5] relative overflow-hidden">
                <img src={img.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 p-4">
                  <div className="flex gap-2 w-full max-w-[160px]">
                    <button onClick={() => onDownload(img.url, `${img.id}.png`)} className="flex-1 p-3 bg-white rounded-xl text-indigo-600 hover:scale-110 transition-transform"><Download size={20} className="mx-auto"/></button>
                    <button onClick={() => onDelete(img.id)} className="flex-1 p-3 bg-white/20 backdrop-blur rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} className="mx-auto" /></button>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{img.niche}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">{new Date(img.createdAt).toLocaleDateString()}</span>
                </div>
                {img.caption && (
                  <button 
                    onClick={() => handleCopy(img.id, img.caption)}
                    className="w-full py-3 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                  >
                    {copiedId === img.id ? (
                      <><CheckCircle size={14} className="text-emerald-500" /> Legenda Copiada!</>
                    ) : (
                      <><Copy size={14} /> Copiar Legenda IA</>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-4 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
           <ImageIcon size={40} className="mx-auto text-gray-300" />
           <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Nenhuma arte encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
