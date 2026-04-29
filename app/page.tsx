'use client';

import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Info, CheckCircle2 } from 'lucide-react';
import { manifestJson, backgroundJs, contentJs, sidepanelHtml, sidepanelJs, stylesCss, base64Icon48 } from '../lib/extension-files';

export default function Home() {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const downloadExtension = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      
      zip.file('manifest.json', manifestJson);
      zip.file('background.js', backgroundJs);
      zip.file('content.js', contentJs);
      zip.file('sidepanel.html', sidepanelHtml);
      zip.file('sidepanel.js', sidepanelJs);
      zip.file('styles.css', stylesCss);
      
      // Decode base64 to binary for icon
      const iconData = atob(base64Icon48);
      const iconArray = new Uint8Array(iconData.length);
      for (let i = 0; i < iconData.length; i++) {
        iconArray[i] = iconData.charCodeAt(i);
      }
      
      zip.file('icon48.png', iconArray, { binary: true });
      zip.file('icon16.png', iconArray, { binary: true }); 
      zip.file('icon128.png', iconArray, { binary: true });

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'smart-sidebar-extension.zip');
    } catch (e) {
      console.error(e);
      alert("Failed to create ZIP file");
    }
    setDownloading(false);
  };

  return (
    <div className="min-h-[100dvh] bg-[#0f0f15] text-slate-300 flex flex-col md:flex-row font-sans relative">
      {/* Fake Chrome Page Preview Background */}
      <div className="hidden md:flex absolute inset-0 z-0 bg-slate-900 flex-col pointer-events-none">
        <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="ml-4 flex-1 h-6 bg-slate-700/50 rounded-md max-w-sm"></div>
        </div>
        <div className="flex-1 bg-[#0f0f15] relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[32px] h-[48px] bg-[#0d0518] border border-purple-400/40 border-r-0 rounded-l-xl shadow-[-4px_4px_16px_rgba(0,0,0,0.2)] flex items-center pl-[6px] z-50 pointer-events-auto cursor-pointer hover:w-[42px] hover:pl-[10px] hover:bg-[#1a0b2e] group transition-all duration-200">
            <img src={`data:image/png;base64,${base64Icon48}`} alt="Sidebar Icon" className="w-5 h-5 rounded transition-transform duration-200 group-hover:scale-110" />
          </div>
        </div>
      </div>

      {/* Left side: Instructions & Download */}
      <div className="flex-1 p-8 md:p-16 flex flex-col max-w-4xl mx-auto md:mx-0 overflow-y-auto w-full md:w-auto relative z-10 backdrop-blur-sm bg-black/40">
        <div className="flex items-center gap-3 mb-8 text-white pt-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <img src={`data:image/png;base64,${base64Icon48}`} alt="Logo" className="w-full h-full rounded-xl" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Smart Sidebar Extension</h1>
        </div>

        <p className="text-lg text-slate-400 mb-8 max-w-2xl leading-relaxed">
          Your custom Chrome extension is ready! It solves the Chrome new tab shortcut limit by providing a persistent, sleek side panel to organize unlimited web apps and shortcuts.
        </p>

        <button 
          onClick={downloadExtension} 
          disabled={downloading}
          className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-4 px-8 rounded-xl shadow-[0_0_24px_rgba(147,51,234,0.3)] transition-all flex items-center justify-center gap-3 w-fit mb-12 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <Download size={20} />
          {downloading ? "Packaging ZIP..." : "Download Extension Source (.zip)"}
        </button>

        <div className="space-y-8 max-w-2xl bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-400" />
              How to install in Chrome
            </h2>
            <ol className="list-decimal list-outside ml-6 space-y-4 text-slate-400">
              <li>Click the download button above to get <code className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-sm whitespace-nowrap">smart-sidebar-extension.zip</code>.</li>
              <li>Extract the ZIP file into a folder on your computer.</li>
              <li>Open Google Chrome and go to <code className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-sm relative group cursor-pointer" onClick={() => { navigator.clipboard.writeText('chrome://extensions'); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>chrome://extensions {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs py-1 px-2 rounded opacity-100 transition-opacity">Copied!</span>}</code> (copy and paste into your URL bar).</li>
              <li>Turn on <strong>&quot;Developer mode&quot;</strong> using the toggle switch in the top right corner.</li>
              <li>Click the <strong>&quot;Load unpacked&quot;</strong> button in the top left.</li>
              <li>Select the extracted folder containing the extension files.</li>
            </ol>
          </section>

          <div className="h-px w-full bg-white/10 my-4"></div>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Info size={20} className="text-blue-400" />
              How to use
            </h2>
            <ul className="list-disc list-outside ml-6 space-y-4 text-slate-400">
              <li><strong>Floating Widget:</strong> A beautiful mini-widget automatically lives on the right edge of any webpage! Just click it to instantly pop out your sidebar.</li>
              <li>Click the extension icon in your Chrome toolbar to instantly open the Sidebar. It feels native!</li>
              <li>Add any website by clicking the floating Action button (+).</li>
              <li>Right-click any shortcut to <strong>Edit</strong> or <strong>Delete</strong> it.</li>
              <li><strong>Click outside feature:</strong> When the sidebar is open, clicking anywhere else in your browser will automatically close the side panel through a smart content script.</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Right side: Interactive Preview */}
      <div className="hidden border-l border-slate-800 bg-[#161622] md:flex items-center justify-center p-8 w-[420px] lg:w-[480px] shrink-0">
        <div className="flex flex-col items-center gap-6 w-full relative">
          <div className="absolute -inset-20 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="text-center space-y-2 z-10 w-full mb-4">
            <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold bg-purple-500/10 py-1.5 px-3 rounded-full border border-purple-500/20 shadow-sm">Live Preview</span>
            <p className="text-sm text-slate-500 mt-2">This is exactly how it will look in Chrome.</p>
          </div>

          <div className="w-[320px] h-[480px] bg-[#1e1e2e] border border-[#313244] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10 ring-4 ring-white/5 mx-auto">
            <SidepanelPreview />
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline mocked version of the Sidepanel for the web preview
function SidepanelPreview() {
  const [timeStr, setTimeStr] = useState("00:00");
  const [dateStr, setDateStr] = useState("Monday, 1");
  const [shortcuts, setShortcuts] = useState([
    { id: '1', name: 'Google', url: 'https://google.com' },
    { id: '2', name: 'YouTube', url: 'https://youtube.com' },
    { id: '3', name: 'GitHub', url: 'https://github.com' },
    { id: '4', name: 'Notion', url: 'https://notion.so' },
    { id: '5', name: 'Dribbble', url: 'https://dribbble.com' },
    { id: '6', name: 'Linear', url: 'https://linear.app' }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalUrl, setModalUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [contextMenu, setContextMenu] = useState<{ id: string, x: number, y: number } | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      setDateStr(`${days[now.getDay()]}, ${now.getDate()}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSave = () => {
    let finalUrl = modalUrl;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    
    if (editingId) {
      setShortcuts(s => s.map(sc => sc.id === editingId ? { ...sc, name: modalName, url: finalUrl } : sc));
    } else {
      setShortcuts(s => [...s, { id: Date.now().toString(), name: modalName, url: finalUrl }]);
    }
    setShowModal(false);
    setContextMenu(null);
  };

  return (
    <div className="absolute inset-0 bg-[#0d0518] bg-[radial-gradient(circle_at_10%_0%,rgba(59,21,107,0.6)_0%,transparent_40%),radial-gradient(circle_at_90%_80%,rgba(32,11,59,0.8)_0%,transparent_50%)] font-[family-name:var(--font-poppins)] text-slate-200 overflow-hidden flex flex-col items-stretch z-10 w-full h-full">
      <div className="flex justify-between items-baseline px-[14px] pt-[10px] pb-[6px] relative shrink-0 flex-row-reverse mb-0">
        <div className="text-[12px] font-normal text-[#a78bfa]">{timeStr}</div>
        <div className="text-[15px] font-semibold text-white/90 tracking-tight">{dateStr}</div>
        <div className="absolute bottom-0 left-[14px] right-[14px] h-[1px] bg-gradient-to-r from-[#c4a8ff] to-transparent opacity-20"></div>
      </div>

      <div className="px-[14px] pt-[8px] flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.15em] text-[#a78bfa]/60 font-semibold">Shortcuts</span>
      </div>

      <div className="flex-1 overflow-y-auto px-[14px] pt-[12px] grid grid-cols-4 gap-[8px] content-start pb-[80px]">
        {shortcuts.map((sc) => {
          let domain = 'example.com';
          try { domain = new URL(sc.url).hostname; } catch (e) {}
          
          return (
            <div 
              key={sc.id}
              className="group relative aspect-square bg-white/5 bg-gradient-to-br from-white/5 to-white/1 flex flex-col items-center justify-center gap-[6px] cursor-pointer backdrop-blur-md border border-white/10 hover:border-purple-400/30 shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(167,139,250,0.2)] hover:bg-purple-400/10 rounded-[4px] p-[6px] transition-all duration-300 hover:-translate-y-[2px] hover:scale-[1.02] active:scale-[0.96]"
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                setContextMenu({ id: sc.id, x: Math.min(e.clientX - rect.left, 80), y: e.clientY - rect.top });
              }}
              onClick={() => alert(`In Chrome, this would navigate to ${sc.url}`)}
            >
              <div className="w-[42px] h-[42px] bg-white/95 rounded-[6px] shadow-[0_4px_12px_rgba(0,0,0,0.2)] flex items-center justify-center p-[4px] overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} 
                  alt={sc.name}
                  className="w-full h-full object-contain pointer-events-none"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%231e1e2e"/></svg>' }}
                />
              </div>
              <div className="text-[9px] font-medium text-white/80 truncate w-full text-center">{sc.name}</div>
              
              <button 
                className="absolute top-1 right-1 w-4 h-4 flex flex-col items-center justify-center gap-[2px] opacity-0 group-hover:opacity-100 hover:bg-white/15 rounded-[6px] transition-all text-white/40 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setContextMenu({ id: sc.id, x: 80, y: 15 });
                }}
              >
                <div className="w-[2px] h-[2px] bg-current rounded-full"></div>
                <div className="w-[2px] h-[2px] bg-current rounded-full"></div>
                <div className="w-[2px] h-[2px] bg-current rounded-full"></div>
              </button>
            </div>
          );
        })}
      </div>

      <button 
        className="absolute bottom-[20px] right-[20px] w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#c4a8ff] to-[#8b5cf6] text-white text-[24px] hover:scale-[1.08] hover:rotate-90 hover:shadow-[0_6px_20px_rgba(167,139,250,0.6)] shadow-[0_4px_16px_rgba(167,139,250,0.4)] transition-all z-10 flex items-center justify-center pb-1 border-none cursor-pointer"
        title="Add Shortcut"
        onClick={() => {
          setEditingId(null);
          setModalName('');
          setModalUrl('');
          setShowModal(true);
        }}
      >
        +
      </button>

      {/* Mock Context Menu */}
      {contextMenu && (
        <div 
          className="absolute bg-[#200b3b]/95 backdrop-blur-md border border-[#c4a8ff]/30 rounded-[10px] p-1 shadow-2xl z-50 min-w-[120px] animate-[popIn_0.2s_ease-out]"
          style={{ 
            left: Math.min(contextMenu.x + 20, 180), 
            top: Math.min(contextMenu.y + 40, 420) 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="px-2.5 py-2 text-[12px] font-medium text-white hover:bg-white/10 rounded-md cursor-pointer transition-colors flex items-center gap-2"
            onClick={() => {
              const sc = shortcuts.find(s => s.id === contextMenu.id);
              if (sc) {
                setEditingId(sc.id);
                setModalName(sc.name);
                setModalUrl(sc.url);
                setShowModal(true);
                setContextMenu(null);
              }
            }}
          >
            Edit
          </div>
          <div 
            className="px-2.5 py-2 text-[12px] font-medium text-[#ff7eb6] hover:bg-[#f38ba8]/15 rounded-md cursor-pointer transition-colors flex items-center gap-2"
            onClick={() => {
              setShortcuts(s => s.filter(sc => sc.id !== contextMenu.id));
              setContextMenu(null);
            }}
          >
            Delete
          </div>
        </div>
      )}

      {/* Mock Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center animate-[fadeIn_0.2s_ease-out] p-4">
          <div className="bg-gradient-to-br from-[#200b3b]/95 to-[#0d0518]/98 border border-[#c4a8ff]/30 rounded-[16px] p-5 w-full max-w-[260px] shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(167,139,250,0.1)] animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] flex flex-col gap-3 mx-auto mt-[-50px]">
            <h3 className="text-[15px] font-semibold text-white m-0 drop-shadow-sm">{editingId ? 'Edit Shortcut' : 'Add Shortcut'}</h3>
            
            <div className="flex flex-col gap-2.5">
              <input 
                type="text" 
                placeholder="Name (max 10 chars)" 
                maxLength={10}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-2 text-[12px] font-[family-name:inherit] text-white focus:outline-none focus:border-[#c4a8ff] focus:ring-2 focus:ring-[#c4a8ff]/20 transition-all m-0"
                value={modalName}
                onChange={(e) => setModalName(e.target.value)}
              />
              <input 
                type="url" 
                placeholder="URL (e.g. google.com)" 
                className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-2 text-[12px] font-[family-name:inherit] text-white focus:outline-none focus:border-[#c4a8ff] focus:ring-2 focus:ring-[#c4a8ff]/20 transition-all m-0"
                value={modalUrl}
                onChange={(e) => setModalUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>

            <div className="flex justify-end gap-2 mt-1">
              <button 
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-[12px] font-medium text-[#a78bfa] hover:bg-white/10 hover:text-white rounded-md transition-colors border-none bg-transparent cursor-pointer font-[family-name:inherit]"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={!modalName || !modalUrl}
                className="px-3 py-1.5 text-[12px] font-semibold bg-[#c4a8ff] text-[#1a0b2e] rounded-md hover:bg-[#d4c1ff] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(167,139,250,0.4)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none border-none cursor-pointer font-[family-name:inherit]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
