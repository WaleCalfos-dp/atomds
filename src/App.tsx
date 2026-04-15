import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/Shell';
import { useBrand } from './hooks/useBrand';

// Getting Started
import { GettingStartedPage } from './pages/GettingStartedPage';

// Foundations
import { BrandFoundationsPage } from './pages/BrandFoundationsPage';
import { BrandSwitcherPage } from './pages/BrandSwitcherPage';
import { BordersPage } from './pages/BordersPage';
import { SpacingPage } from './pages/SpacingPage';

// Components
import { BadgePage } from './pages/BadgePage';
import { AlertPage } from './pages/AlertPage';
import { ButtonPage } from './pages/ButtonPage';
import { CheckboxPage } from './pages/CheckboxPage';
import { DividerPage } from './pages/DividerPage';
import { InputPage } from './pages/InputPage';
import { SwitchPage } from './pages/SwitchPage';
import { TagsPage } from './pages/TagsPage';
import { TooltipPage } from './pages/TooltipPage';
import { LineItemPage } from './pages/LineItemPage';
import { ProgressIndicatorPage } from './pages/ProgressIndicatorPage';
import { StepsPage } from './pages/StepsPage';
import { TabsPage } from './pages/TabsPage';

export default function App() {
  const { brand, setBrand } = useBrand();
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell brand={brand} setBrand={setBrand}>
        <Routes>
          <Route path="/" element={<Navigate to="/getting-started" replace />} />

          {/* Getting Started */}
          <Route path="/getting-started" element={<GettingStartedPage brand={brand} />} />

          {/* Foundations */}
          <Route path="/foundations/brand-foundations" element={<BrandFoundationsPage brand={brand} />} />
          <Route path="/foundations/brand-switcher" element={<BrandSwitcherPage brand={brand} />} />
          <Route path="/foundations/borders" element={<BordersPage brand={brand} />} />
          <Route path="/foundations/spacing" element={<SpacingPage brand={brand} />} />

          {/* Components */}
          <Route path="/components/alert" element={<AlertPage brand={brand} />} />
          <Route path="/components/button" element={<ButtonPage brand={brand} />} />
          <Route path="/components/badge" element={<BadgePage brand={brand} />} />
          <Route path="/components/checkbox" element={<CheckboxPage brand={brand} />} />
          <Route path="/components/divider" element={<DividerPage brand={brand} />} />
          <Route path="/components/input" element={<InputPage brand={brand} />} />
          <Route path="/components/switch" element={<SwitchPage brand={brand} />} />
          <Route path="/components/tags" element={<TagsPage brand={brand} />} />
          <Route path="/components/tooltip" element={<TooltipPage brand={brand} />} />
          <Route path="/components/line-item" element={<LineItemPage brand={brand} />} />
          <Route path="/components/progress-indicator" element={<ProgressIndicatorPage brand={brand} />} />
          <Route path="/components/steps" element={<StepsPage brand={brand} />} />
          <Route path="/components/tabs" element={<TabsPage brand={brand} />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
