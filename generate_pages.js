const fs = require('fs');
const dirs = ['pendaftaran', 'rawat-inap', 'farmasi', 'laboratorium', 'laporan', 'pengaturan'];
const content = (title) => `export default function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
      <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-4xl mb-4">
        🚧
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Halaman ${title}</h2>
      <p className="text-slate-500">
        Modul ini masih dalam tahap pengembangan dan belum dapat diakses pada versi demo ini.
      </p>
    </div>
  )
}
`;

dirs.forEach(d => {
  fs.mkdirSync(`src/app/${d}`, { recursive: true });
  fs.writeFileSync(`src/app/${d}/page.js`, content(d.charAt(0).toUpperCase() + d.slice(1)));
});
