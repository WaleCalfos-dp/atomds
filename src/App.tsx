import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/Shell';
import { useBrand } from './hooks/useBrand';
import { useCustomBrand } from './hooks/useCustomBrand';
import { useLanguage } from './hooks/useLanguage';

// Getting Started
import { GettingStartedPage } from './pages/GettingStartedPage';

// Tools
import { PortalPage } from './pages/PortalPage';
import { MappingPage } from './pages/MappingPage';

// Token-Component Link
import { TokenComponentLinkOverviewPage } from './pages/TokenComponentLinkOverviewPage';
import { TokenComponentLinkDetailPage } from './pages/TokenComponentLinkDetailPage';

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
  const { lang, setLang } = useLanguage();
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell brand={brand} setBrand={setBrand} customBrand={customBrand} lang={lang} setLang={setLang}>
        <Routes>
          <Route path="/" element={<Navigate to="/getting-started" replace />} />

          {/* Getting Started */}
          <Route path="/getting-started" element={<GettingStartedPage brand={brand} lang={lang} />} />

          {/* Tools */}
          <Route
            path="/portal"
            element={
              <PortalPage
                customBrand={customBrand}
                setCustomBrand={setCustomBrand}
                clearCustomBrand={clearCustomBrand}
                setBrand={setBrand}
                lang={lang}
              />
            }
          />
          <Route path="/portal/mapping" element={<MappingPage brand={brand} lang={lang} />} />

          {/* Token-Component Link */}
          <Route path="/token-component-link" element={<TokenComponentLinkOverviewPage brand={brand} lang={lang} />} />
          <Route path="/token-component-link/:tokenSlug" element={<TokenComponentLinkDetailPage brand={brand} lang={lang} />} />

          {/* Foundations */}
          <Route path="/foundations/brand-foundations" element={<BrandFoundationsPage brand={brand} lang={lang} />} />
          <Route path="/foundations/brand-switcher" element={<BrandSwitcherPage brand={brand} lang={lang} />} />
          <Route path="/foundations/borders" element={<BordersPage brand={brand} lang={lang} />} />
          <Route path="/foundations/spacing" element={<SpacingPage brand={brand} lang={lang} />} />

          {/* Components */}
          <Route path="/components/accordion" element={<AccordionPage brand={brand} lang={lang} />} />
          <Route path="/components/alert" element={<AlertPage brand={brand} lang={lang} />} />
          <Route path="/components/avatar" element={<AvatarPage brand={brand} lang={lang} />} />
          <Route path="/components/badge" element={<BadgePage brand={brand} lang={lang} />} />
          <Route path="/components/breadcrumbs" element={<BreadcrumbsPage brand={brand} lang={lang} />} />
          <Route path="/components/button" element={<ButtonPage brand={brand} lang={lang} />} />
          <Route path="/components/button-group" element={<ButtonGroupPage brand={brand} lang={lang} />} />
          <Route path="/components/card" element={<CardPage brand={brand} lang={lang} />} />
          <Route path="/components/checkbox" element={<CheckboxPage brand={brand} lang={lang} />} />
          <Route path="/components/data-row" element={<DataRowPage brand={brand} lang={lang} />} />
          <Route path="/components/data-group" element={<DataGroupPage brand={brand} lang={lang} />} />
          <Route path="/components/data-group-no-slot" element={<DataGroupNoSlotPage brand={brand} lang={lang} />} />
          <Route path="/components/date-picker" element={<DatePickerPage brand={brand} lang={lang} />} />
          <Route path="/components/dialog" element={<DialogPage brand={brand} lang={lang} />} />
          <Route path="/components/divider" element={<DividerPage brand={brand} lang={lang} />} />
          <Route path="/components/input" element={<InputPage brand={brand} lang={lang} />} />
          <Route path="/components/line-item" element={<LineItemPage brand={brand} lang={lang} />} />
          <Route path="/components/list-item" element={<ListItemPage brand={brand} lang={lang} />} />
          <Route path="/components/media" element={<MediaPage brand={brand} lang={lang} />} />
          <Route path="/components/progress-indicator" element={<ProgressIndicatorPage brand={brand} lang={lang} />} />
          <Route path="/components/qr-code" element={<QRCodePage brand={brand} lang={lang} />} />
          <Route path="/components/quantity-stepper" element={<QuantityStepperPage brand={brand} lang={lang} />} />
          <Route path="/components/select" element={<SelectPage brand={brand} lang={lang} />} />
          <Route path="/components/stepper" element={<StepperPage brand={brand} lang={lang} />} />
          <Route path="/components/steps" element={<StepsPage brand={brand} lang={lang} />} />
          <Route path="/components/switch" element={<SwitchPage brand={brand} lang={lang} />} />
          <Route path="/components/tabs" element={<TabsPage brand={brand} lang={lang} />} />
          <Route path="/components/tags" element={<TagsPage brand={brand} lang={lang} />} />
          <Route path="/components/tiles" element={<TilesPage brand={brand} lang={lang} />} />
          <Route path="/components/time-picker" element={<TimePickerPage brand={brand} lang={lang} />} />
          <Route path="/components/toast" element={<ToastPage brand={brand} lang={lang} />} />
          <Route path="/components/tooltip" element={<TooltipPage brand={brand} lang={lang} />} />
          <Route path="/components/transport-card" element={<TransportCardPage brand={brand} lang={lang} />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
