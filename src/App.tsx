import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/Shell';
import { useBrand } from './hooks/useBrand';
import { useCustomBrand } from './hooks/useCustomBrand';

// Getting Started
import { GettingStartedPage } from './pages/GettingStartedPage';

// Tools
import { PortalPage } from './pages/PortalPage';
import { MappingPage } from './pages/MappingPage';

// Foundations
import { BrandFoundationsPage } from './pages/BrandFoundationsPage';
import { BrandSwitcherPage } from './pages/BrandSwitcherPage';
import { BordersPage } from './pages/BordersPage';
import { SpacingPage } from './pages/SpacingPage';

// Components
import { AccordionPage } from './pages/AccordionPage';
import { AlertPage } from './pages/AlertPage';
import { AvatarPage } from './pages/AvatarPage';
import { BadgePage } from './pages/BadgePage';
import { BreadcrumbsPage } from './pages/BreadcrumbsPage';
import { ButtonPage } from './pages/ButtonPage';
import { ButtonGroupPage } from './pages/ButtonGroupPage';
import { CardPage } from './pages/CardPage';
import { CheckboxPage } from './pages/CheckboxPage';
import { DataRowPage } from './pages/DataRowPage';
import { DataGroupPage } from './pages/DataGroupPage';
import { DataGroupNoSlotPage } from './pages/DataGroupNoSlotPage';
import { DatePickerPage } from './pages/DatePickerPage';
import { DialogPage } from './pages/DialogPage';
import { DividerPage } from './pages/DividerPage';
import { InputPage } from './pages/InputPage';
import { LineItemPage } from './pages/LineItemPage';
import { ListItemPage } from './pages/ListItemPage';
import { MediaPage } from './pages/MediaPage';
import { ProgressIndicatorPage } from './pages/ProgressIndicatorPage';
import { QRCodePage } from './pages/QRCodePage';
import { QuantityStepperPage } from './pages/QuantityStepperPage';
import { SelectPage } from './pages/SelectPage';
import { StepperPage } from './pages/StepperPage';
import { StepsPage } from './pages/StepsPage';
import { SwitchPage } from './pages/SwitchPage';
import { TabsPage } from './pages/TabsPage';
import { TagsPage } from './pages/TagsPage';
import { TilesPage } from './pages/TilesPage';
import { TimePickerPage } from './pages/TimePickerPage';
import { ToastPage } from './pages/ToastPage';
import { TooltipPage } from './pages/TooltipPage';
import { TransportCardPage } from './pages/TransportCardPage';

export default function App() {
  const { brand, setBrand } = useBrand();
  const { customBrand, setCustomBrand, clearCustomBrand } = useCustomBrand();
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell brand={brand} setBrand={setBrand} customBrand={customBrand}>
        <Routes>
          <Route path="/" element={<Navigate to="/getting-started" replace />} />

          {/* Getting Started */}
          <Route path="/getting-started" element={<GettingStartedPage brand={brand} />} />

          {/* Tools */}
          <Route
            path="/portal"
            element={
              <PortalPage
                customBrand={customBrand}
                setCustomBrand={setCustomBrand}
                clearCustomBrand={clearCustomBrand}
                setBrand={setBrand}
              />
            }
          />
          <Route path="/portal/mapping" element={<MappingPage brand={brand} />} />

          {/* Foundations */}
          <Route path="/foundations/brand-foundations" element={<BrandFoundationsPage brand={brand} />} />
          <Route path="/foundations/brand-switcher" element={<BrandSwitcherPage brand={brand} />} />
          <Route path="/foundations/borders" element={<BordersPage brand={brand} />} />
          <Route path="/foundations/spacing" element={<SpacingPage brand={brand} />} />

          {/* Components */}
          <Route path="/components/accordion" element={<AccordionPage brand={brand} />} />
          <Route path="/components/alert" element={<AlertPage brand={brand} />} />
          <Route path="/components/avatar" element={<AvatarPage brand={brand} />} />
          <Route path="/components/badge" element={<BadgePage brand={brand} />} />
          <Route path="/components/breadcrumbs" element={<BreadcrumbsPage brand={brand} />} />
          <Route path="/components/button" element={<ButtonPage brand={brand} />} />
          <Route path="/components/button-group" element={<ButtonGroupPage brand={brand} />} />
          <Route path="/components/card" element={<CardPage brand={brand} />} />
          <Route path="/components/checkbox" element={<CheckboxPage brand={brand} />} />
          <Route path="/components/data-row" element={<DataRowPage brand={brand} />} />
          <Route path="/components/data-group" element={<DataGroupPage brand={brand} />} />
          <Route path="/components/data-group-no-slot" element={<DataGroupNoSlotPage brand={brand} />} />
          <Route path="/components/date-picker" element={<DatePickerPage brand={brand} />} />
          <Route path="/components/dialog" element={<DialogPage brand={brand} />} />
          <Route path="/components/divider" element={<DividerPage brand={brand} />} />
          <Route path="/components/input" element={<InputPage brand={brand} />} />
          <Route path="/components/line-item" element={<LineItemPage brand={brand} />} />
          <Route path="/components/list-item" element={<ListItemPage brand={brand} />} />
          <Route path="/components/media" element={<MediaPage brand={brand} />} />
          <Route path="/components/progress-indicator" element={<ProgressIndicatorPage brand={brand} />} />
          <Route path="/components/qr-code" element={<QRCodePage brand={brand} />} />
          <Route path="/components/quantity-stepper" element={<QuantityStepperPage brand={brand} />} />
          <Route path="/components/select" element={<SelectPage brand={brand} />} />
          <Route path="/components/stepper" element={<StepperPage brand={brand} />} />
          <Route path="/components/steps" element={<StepsPage brand={brand} />} />
          <Route path="/components/switch" element={<SwitchPage brand={brand} />} />
          <Route path="/components/tabs" element={<TabsPage brand={brand} />} />
          <Route path="/components/tags" element={<TagsPage brand={brand} />} />
          <Route path="/components/tiles" element={<TilesPage brand={brand} />} />
          <Route path="/components/time-picker" element={<TimePickerPage brand={brand} />} />
          <Route path="/components/toast" element={<ToastPage brand={brand} />} />
          <Route path="/components/tooltip" element={<TooltipPage brand={brand} />} />
          <Route path="/components/transport-card" element={<TransportCardPage brand={brand} />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
