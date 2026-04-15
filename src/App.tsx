import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/Shell';
import { useBrand } from './hooks/useBrand';
import { BadgePage } from './pages/BadgePage';
import { AlertPage } from './pages/AlertPage';
import { ButtonPage } from './pages/ButtonPage';
import { CheckboxPage } from './pages/CheckboxPage';
import { DividerPage } from './pages/DividerPage';
import { InputPage } from './pages/InputPage';
import { SwitchPage } from './pages/SwitchPage';
import { TagsPage } from './pages/TagsPage';

export default function App() {
  const { brand, setBrand } = useBrand();
  return (
    <BrowserRouter>
      <Shell brand={brand} setBrand={setBrand}>
        <Routes>
          <Route path="/" element={<Navigate to="/components/badge" replace />} />
          <Route path="/components/alert" element={<AlertPage brand={brand} />} />
          <Route path="/components/button" element={<ButtonPage brand={brand} />} />
          <Route path="/components/badge" element={<BadgePage brand={brand} />} />
          <Route path="/components/checkbox" element={<CheckboxPage brand={brand} />} />
          <Route path="/components/divider" element={<DividerPage brand={brand} />} />
          <Route path="/components/input" element={<InputPage brand={brand} />} />
          <Route path="/components/switch" element={<SwitchPage brand={brand} />} />
          <Route path="/components/tags" element={<TagsPage brand={brand} />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
