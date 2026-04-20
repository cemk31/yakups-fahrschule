import { HeroSection } from "./HeroSection";
import { UspStrip } from "./UspStrip";
import { ClassGrid } from "./ClassGrid";
import { FaqAccordion } from "./FaqAccordion";
import { Page } from "./Page";
import { LkwSpotlight } from "./LkwSpotlight";
import { ProcessSteps } from "./ProcessSteps";
import { PricingTable } from "./PricingTable";
import { LocationsMap } from "./LocationsMap";
import { TeamGrid } from "./TeamGrid";
import { BlogTeaser } from "./BlogTeaser";
import { ReviewsSection } from "./ReviewsSection";
import { CtaSection } from "./CtaSection";
import { ValueCards } from "./ValueCards";
import { LicenseClassGrid } from "./LicenseClassGrid";
import { ComparisonTable } from "./ComparisonTable";
import { DownloadSection } from "./DownloadSection";
import { ContactForm } from "./ContactForm";
import { BlogIndex } from "./BlogIndex";

/**
 * Dieses Objekt ist das Zentrum des Systems.
 * Jeder Storyblok-Blok mit technischem Namen "hero_section" wird in React zu
 * <HeroSection />. Neuer Blok? Einfach hier eintragen - die Routes müssen
 * nie angefasst werden.
 */
export const components = {
  page: Page,
  hero_section: HeroSection,
  usp_strip: UspStrip,
  class_grid: ClassGrid,
  faq_accordion: FaqAccordion,
  lkw_spotlight: LkwSpotlight,
  process_steps: ProcessSteps,
  pricing_table: PricingTable,
  locations_map: LocationsMap,
  team_grid: TeamGrid,
  blog_teaser: BlogTeaser,
  reviews_section: ReviewsSection,
  cta_section: CtaSection,
  value_cards: ValueCards,
  license_class_grid: LicenseClassGrid,
  comparison_table: ComparisonTable,
  download_section: DownloadSection,
  contact_form: ContactForm,
  blog_index: BlogIndex,
};

export type BlokName = keyof typeof components;
