import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
  createCartWorkflow,
} from "@medusajs/core-flows";
import {
  ExecArgs,
  IAuthModuleService,
  ICustomerModuleService,
  IFulfillmentModuleService,
  ISalesChannelModuleService,
  IStoreModuleService,
  IUserModuleService,
} from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import Scrypt from "scrypt-kdf";
import { COMPANY_MODULE } from "../modules/company";
import { ICompanyModuleService } from "../types";
import { createCompaniesWorkflow } from "../workflows/company/workflows/create-companies";
import { addCompanyToCustomerGroupWorkflow } from "../workflows/company/workflows/add-company-to-customer-group";
import { createEmployeesWorkflow } from "../workflows/employee/workflows/create-employees";
import { createRequestForQuoteWorkflow } from "../workflows/quote/workflows/create-request-for-quote";
import { merchantSendQuoteWorkflow } from "../workflows/quote/workflows/merchant-send-quote";
import { customerAcceptQuoteWorkflow } from "../workflows/quote/workflows/customer-accept-quote";
import { customerRejectQuoteWorkflow } from "../workflows/quote/workflows/customer-reject-quote";
import { createQuoteMessageWorkflow } from "../workflows/quote/workflows/create-quote-message";

// ---------------------------------------------------------------------------
// Placeholder image helper
// ---------------------------------------------------------------------------
function img(text: string, idx = 0): string {
  const colors = ["0047AB", "1E3A5F", "B8860B", "8B4513", "2E8B57"];
  return `https://placehold.co/600x600/${colors[idx % colors.length]}/white?text=${encodeURIComponent(text)}`;
}

// ---------------------------------------------------------------------------
// Product data definitions
// ---------------------------------------------------------------------------

interface VariantDef {
  title: string;
  sku: string;
  options: Record<string, string>;
  price: number;
}

interface ProductDef {
  handle: string;
  title: string;
  description: string;
  categoryHandle: string;
  collectionHandles?: string[];
  status: "published" | "draft";
  weight: number;
  options: { title: string; values: string[] }[];
  variants: VariantDef[];
}

// --- Azulejos Decorativos (12 products) ---
const azulejos: ProductDef[] = [
  {
    handle: "azulejo-tradicional-portugues",
    title: "Azulejo Tradicional Portugues",
    description:
      "Azulejo pintado a mao com motivos tradicionais portugueses em tons de azul e branco. Perfeito para decoracao de interiores e exteriores.",
    categoryHandle: "azulejos-decorativos",
    collectionHandles: ["destaques"],
    status: "published",
    weight: 300,
    options: [
      { title: "Tamanho", values: ["Pequeno", "Medio", "Grande"] },
      { title: "Design", values: ["Azul Tradicional", "Multicolor"] },
    ],
    variants: [
      { title: "Pequeno / Azul Tradicional", sku: "AZ-TRAD-P-AT", options: { Tamanho: "Pequeno", Design: "Azul Tradicional" }, price: 5 },
      { title: "Medio / Azul Tradicional", sku: "AZ-TRAD-M-AT", options: { Tamanho: "Medio", Design: "Azul Tradicional" }, price: 8 },
      { title: "Grande / Azul Tradicional", sku: "AZ-TRAD-G-AT", options: { Tamanho: "Grande", Design: "Azul Tradicional" }, price: 12 },
      { title: "Pequeno / Multicolor", sku: "AZ-TRAD-P-MC", options: { Tamanho: "Pequeno", Design: "Multicolor" }, price: 6 },
      { title: "Medio / Multicolor", sku: "AZ-TRAD-M-MC", options: { Tamanho: "Medio", Design: "Multicolor" }, price: 9 },
      { title: "Grande / Multicolor", sku: "AZ-TRAD-G-MC", options: { Tamanho: "Grande", Design: "Multicolor" }, price: 14 },
    ],
  },
  {
    handle: "azulejo-flor-de-lisboa",
    title: "Azulejo Flor de Lisboa",
    description:
      "Azulejo decorativo com motivo floral inspirado nos jardins de Lisboa. Acabamento de alta qualidade disponivel em brilhante e mate.",
    categoryHandle: "azulejos-decorativos",
    collectionHandles: ["destaques", "novidades"],
    status: "published",
    weight: 300,
    options: [
      { title: "Tamanho", values: ["Pequeno", "Medio", "Grande"] },
      { title: "Acabamento", values: ["Brilhante", "Mate"] },
    ],
    variants: [
      { title: "Pequeno / Brilhante", sku: "AZ-FLOR-P-BR", options: { Tamanho: "Pequeno", Acabamento: "Brilhante" }, price: 6 },
      { title: "Medio / Brilhante", sku: "AZ-FLOR-M-BR", options: { Tamanho: "Medio", Acabamento: "Brilhante" }, price: 10 },
      { title: "Grande / Brilhante", sku: "AZ-FLOR-G-BR", options: { Tamanho: "Grande", Acabamento: "Brilhante" }, price: 15 },
      { title: "Pequeno / Mate", sku: "AZ-FLOR-P-MT", options: { Tamanho: "Pequeno", Acabamento: "Mate" }, price: 6 },
      { title: "Medio / Mate", sku: "AZ-FLOR-M-MT", options: { Tamanho: "Medio", Acabamento: "Mate" }, price: 10 },
      { title: "Grande / Mate", sku: "AZ-FLOR-G-MT", options: { Tamanho: "Grande", Acabamento: "Mate" }, price: 15 },
    ],
  },
  {
    handle: "azulejo-galo-de-barcelos",
    title: "Azulejo Galo de Barcelos",
    description:
      "Azulejo com representacao do icónico Galo de Barcelos, simbolo de Portugal. Design colorido com acabamento ceramico tradicional.",
    categoryHandle: "azulejos-decorativos",
    collectionHandles: ["destaques"],
    status: "published",
    weight: 300,
    options: [
      { title: "Tamanho", values: ["Pequeno", "Medio", "Grande"] },
    ],
    variants: [
      { title: "Pequeno", sku: "AZ-GALO-P", options: { Tamanho: "Pequeno" }, price: 7 },
      { title: "Medio", sku: "AZ-GALO-M", options: { Tamanho: "Medio" }, price: 11 },
      { title: "Grande", sku: "AZ-GALO-G", options: { Tamanho: "Grande" }, price: 16 },
    ],
  },
  {
    handle: "azulejo-sardinha",
    title: "Azulejo Sardinha",
    description:
      "Azulejo decorativo com motivo de sardinha, celebrando a tradicao das festas populares portuguesas. Cores vibrantes e acabamento brilhante.",
    categoryHandle: "azulejos-decorativos",
    collectionHandles: ["novidades"],
    status: "published",
    weight: 300,
    options: [
      { title: "Tamanho", values: ["Pequeno", "Medio", "Grande"] },
    ],
    variants: [
      { title: "Pequeno", sku: "AZ-SARD-P", options: { Tamanho: "Pequeno" }, price: 5 },
      { title: "Medio", sku: "AZ-SARD-M", options: { Tamanho: "Medio" }, price: 8 },
      { title: "Grande", sku: "AZ-SARD-G", options: { Tamanho: "Grande" }, price: 12 },
    ],
  },
  {
    handle: "azulejo-coracao-de-viana",
    title: "Azulejo Coracao de Viana",
    description:
      "Azulejo com o famoso Coracao de Viana, simbolo do amor e da filigrana portuguesa. Disponivel em azul tradicional e multicolor.",
    categoryHandle: "azulejos-decorativos",
    collectionHandles: ["destaques"],
    status: "published",
    weight: 300,
    options: [
      { title: "Tamanho", values: ["Pequeno", "Medio"] },
      { title: "Design", values: ["Azul Tradicional", "Multicolor"] },
    ],
    variants: [
      { title: "Pequeno / Azul Tradicional", sku: "AZ-COR-P-AT", options: { Tamanho: "Pequeno", Design: "Azul Tradicional" }, price: 6 },
      { title: "Medio / Azul Tradicional", sku: "AZ-COR-M-AT", options: { Tamanho: "Medio", Design: "Azul Tradicional" }, price: 10 },
      { title: "Pequeno / Multicolor", sku: "AZ-COR-P-MC", options: { Tamanho: "Pequeno", Design: "Multicolor" }, price: 7 },
      { title: "Medio / Multicolor", sku: "AZ-COR-M-MC", options: { Tamanho: "Medio", Design: "Multicolor" }, price: 11 },
    ],
  },
  {
    handle: "azulejo-fado",
    title: "Azulejo Fado",
    description:
      "Azulejo artistico com cena de Fado, a musica tradicional portuguesa. Representa uma fadista com guitarra portuguesa.",
    categoryHandle: "azulejos-decorativos",
    status: "published",
    weight: 300,
    options: [
      { title: "Tamanho", values: ["Pequeno", "Medio", "Grande"] },
    ],
    variants: [
      { title: "Pequeno", sku: "AZ-FADO-P", options: { Tamanho: "Pequeno" }, price: 7 },
      { title: "Medio", sku: "AZ-FADO-M", options: { Tamanho: "Medio" }, price: 11 },
      { title: "Grande", sku: "AZ-FADO-G", options: { Tamanho: "Grande" }, price: 16 },
    ],
  },
  {
    handle: "azulejo-maritimo",
    title: "Azulejo Maritimo",
    description:
      "Azulejo com motivos maritimos inspirados nos Descobrimentos Portugueses. Caravelas, rosas-dos-ventos e ondas do mar.",
    categoryHandle: "azulejos-decorativos",
    collectionHandles: ["novidades"],
    status: "published",
    weight: 300,
    options: [
      { title: "Tamanho", values: ["Pequeno", "Medio", "Grande"] },
      { title: "Acabamento", values: ["Brilhante", "Mate"] },
    ],
    variants: [
      { title: "Pequeno / Brilhante", sku: "AZ-MAR-P-BR", options: { Tamanho: "Pequeno", Acabamento: "Brilhante" }, price: 7 },
      { title: "Medio / Brilhante", sku: "AZ-MAR-M-BR", options: { Tamanho: "Medio", Acabamento: "Brilhante" }, price: 11 },
      { title: "Grande / Mate", sku: "AZ-MAR-G-MT", options: { Tamanho: "Grande", Acabamento: "Mate" }, price: 17 },
    ],
  },
  {
    handle: "azulejo-geometrico",
    title: "Azulejo Geometrico",
    description:
      "Azulejo com padroes geometricos inspirados na azulejaria classica portuguesa. Design moderno com raizes tradicionais.",
    categoryHandle: "azulejos-decorativos",
    collectionHandles: ["destaques"],
    status: "published",
    weight: 300,
    options: [
      { title: "Tamanho", values: ["Pequeno", "Medio", "Grande"] },
      { title: "Design", values: ["Azul Tradicional", "Branco", "Multicolor"] },
    ],
    variants: [
      { title: "Pequeno / Azul", sku: "AZ-GEO-P-AT", options: { Tamanho: "Pequeno", Design: "Azul Tradicional" }, price: 5 },
      { title: "Medio / Branco", sku: "AZ-GEO-M-BR", options: { Tamanho: "Medio", Design: "Branco" }, price: 9 },
      { title: "Grande / Multicolor", sku: "AZ-GEO-G-MC", options: { Tamanho: "Grande", Design: "Multicolor" }, price: 14 },
    ],
  },
  {
    handle: "azulejo-arraiolos",
    title: "Azulejo Arraiolos",
    description:
      "Azulejo decorativo com padroes inspirados nos tapetes de Arraiolos, patrimonio cultural portugues.",
    categoryHandle: "azulejos-decorativos",
    status: "published",
    weight: 300,
    options: [
      { title: "Tamanho", values: ["Pequeno", "Medio", "Grande"] },
    ],
    variants: [
      { title: "Pequeno", sku: "AZ-ARR-P", options: { Tamanho: "Pequeno" }, price: 8 },
      { title: "Medio", sku: "AZ-ARR-M", options: { Tamanho: "Medio" }, price: 12 },
      { title: "Grande", sku: "AZ-ARR-G", options: { Tamanho: "Grande" }, price: 18 },
    ],
  },
  {
    handle: "azulejo-manuelino",
    title: "Azulejo Manuelino",
    description:
      "Azulejo com motivos do estilo Manuelino, evocando a era dos Descobrimentos. Cordas, esferas armilares e cruzes da Ordem de Cristo.",
    categoryHandle: "azulejos-decorativos",
    collectionHandles: ["edicao-limitada"],
    status: "published",
    weight: 300,
    options: [
      { title: "Tamanho", values: ["Medio", "Grande"] },
      { title: "Acabamento", values: ["Brilhante", "Mate"] },
    ],
    variants: [
      { title: "Medio / Brilhante", sku: "AZ-MAN-M-BR", options: { Tamanho: "Medio", Acabamento: "Brilhante" }, price: 14 },
      { title: "Grande / Brilhante", sku: "AZ-MAN-G-BR", options: { Tamanho: "Grande", Acabamento: "Brilhante" }, price: 22 },
      { title: "Medio / Mate", sku: "AZ-MAN-M-MT", options: { Tamanho: "Medio", Acabamento: "Mate" }, price: 14 },
      { title: "Grande / Mate", sku: "AZ-MAN-G-MT", options: { Tamanho: "Grande", Acabamento: "Mate" }, price: 22 },
    ],
  },
  {
    handle: "azulejo-lisboa-antiga",
    title: "Azulejo Lisboa Antiga",
    description:
      "Azulejo com vista panoramica da Lisboa antiga, representando os telhados e o rio Tejo. Peca de colecao em edicao limitada.",
    categoryHandle: "azulejos-decorativos",
    collectionHandles: ["edicao-limitada"],
    status: "draft",
    weight: 350,
    options: [
      { title: "Tamanho", values: ["Medio", "Grande"] },
    ],
    variants: [
      { title: "Medio", sku: "AZ-LISB-M", options: { Tamanho: "Medio" }, price: 18 },
      { title: "Grande", sku: "AZ-LISB-G", options: { Tamanho: "Grande" }, price: 25 },
    ],
  },
  {
    handle: "azulejo-contemporaneo",
    title: "Azulejo Contemporaneo",
    description:
      "Azulejo com design contemporaneo que reinterpreta a azulejaria tradicional com linhas modernas e cores ousadas.",
    categoryHandle: "azulejos-decorativos",
    status: "draft",
    weight: 300,
    options: [
      { title: "Tamanho", values: ["Pequeno", "Medio", "Grande"] },
    ],
    variants: [
      { title: "Pequeno", sku: "AZ-CONT-P", options: { Tamanho: "Pequeno" }, price: 8 },
      { title: "Medio", sku: "AZ-CONT-M", options: { Tamanho: "Medio" }, price: 13 },
      { title: "Grande", sku: "AZ-CONT-G", options: { Tamanho: "Grande" }, price: 20 },
    ],
  },
];

// --- Imanes Ceramicos (10 products) ---
const imanes: ProductDef[] = [
  {
    handle: "iman-azulejo-classico",
    title: "Iman Azulejo Classico",
    description: "Iman ceramico miniatura reproduzindo azulejos classicos portugueses. Ideal para recordacao e presentes.",
    categoryHandle: "imanes-ceramicos",
    collectionHandles: ["destaques"],
    status: "published",
    weight: 30,
    options: [
      { title: "Design", values: ["Azul Tradicional", "Branco", "Multicolor"] },
      { title: "Embalagem", values: ["Unidade", "Pack 6", "Pack 12"] },
    ],
    variants: [
      { title: "Azul / Unidade", sku: "IM-CLASS-AT-1", options: { Design: "Azul Tradicional", Embalagem: "Unidade" }, price: 3 },
      { title: "Azul / Pack 6", sku: "IM-CLASS-AT-6", options: { Design: "Azul Tradicional", Embalagem: "Pack 6" }, price: 15 },
      { title: "Azul / Pack 12", sku: "IM-CLASS-AT-12", options: { Design: "Azul Tradicional", Embalagem: "Pack 12" }, price: 27 },
      { title: "Multicolor / Unidade", sku: "IM-CLASS-MC-1", options: { Design: "Multicolor", Embalagem: "Unidade" }, price: 3 },
      { title: "Multicolor / Pack 6", sku: "IM-CLASS-MC-6", options: { Design: "Multicolor", Embalagem: "Pack 6" }, price: 15 },
    ],
  },
  {
    handle: "iman-galo-barcelos",
    title: "Iman Galo de Barcelos",
    description: "Iman ceramico com o Galo de Barcelos, o simbolo mais reconhecivel de Portugal.",
    categoryHandle: "imanes-ceramicos",
    collectionHandles: ["destaques"],
    status: "published",
    weight: 30,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6", "Pack 12"] },
    ],
    variants: [
      { title: "Unidade", sku: "IM-GALO-1", options: { Embalagem: "Unidade" }, price: 3 },
      { title: "Pack 6", sku: "IM-GALO-6", options: { Embalagem: "Pack 6" }, price: 15 },
      { title: "Pack 12", sku: "IM-GALO-12", options: { Embalagem: "Pack 12" }, price: 27 },
    ],
  },
  {
    handle: "iman-sardinha",
    title: "Iman Sardinha",
    description: "Iman em forma de sardinha colorida, celebrando as festas de Santos Populares.",
    categoryHandle: "imanes-ceramicos",
    collectionHandles: ["novidades"],
    status: "published",
    weight: 25,
    options: [
      { title: "Design", values: ["Multicolor", "Azul Tradicional"] },
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
    ],
    variants: [
      { title: "Multicolor / Unidade", sku: "IM-SARD-MC-1", options: { Design: "Multicolor", Embalagem: "Unidade" }, price: 2 },
      { title: "Multicolor / Pack 6", sku: "IM-SARD-MC-6", options: { Design: "Multicolor", Embalagem: "Pack 6" }, price: 10 },
      { title: "Azul / Unidade", sku: "IM-SARD-AT-1", options: { Design: "Azul Tradicional", Embalagem: "Unidade" }, price: 2 },
      { title: "Azul / Pack 6", sku: "IM-SARD-AT-6", options: { Design: "Azul Tradicional", Embalagem: "Pack 6" }, price: 10 },
    ],
  },
  {
    handle: "iman-coracao-viana",
    title: "Iman Coracao de Viana",
    description: "Iman ceramico com o Coracao de Viana, simbolo do amor portugues.",
    categoryHandle: "imanes-ceramicos",
    status: "published",
    weight: 25,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6", "Pack 12"] },
    ],
    variants: [
      { title: "Unidade", sku: "IM-COR-1", options: { Embalagem: "Unidade" }, price: 3 },
      { title: "Pack 6", sku: "IM-COR-6", options: { Embalagem: "Pack 6" }, price: 15 },
      { title: "Pack 12", sku: "IM-COR-12", options: { Embalagem: "Pack 12" }, price: 27 },
    ],
  },
  {
    handle: "iman-lisboa",
    title: "Iman Lisboa",
    description: "Iman ceramico com monumentos iconicos de Lisboa: Torre de Belem, Mosteiro dos Jeronimos e Elevador de Santa Justa.",
    categoryHandle: "imanes-ceramicos",
    collectionHandles: ["destaques"],
    status: "published",
    weight: 30,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
    ],
    variants: [
      { title: "Unidade", sku: "IM-LISB-1", options: { Embalagem: "Unidade" }, price: 4 },
      { title: "Pack 6", sku: "IM-LISB-6", options: { Embalagem: "Pack 6" }, price: 20 },
    ],
  },
  {
    handle: "iman-porto",
    title: "Iman Porto",
    description: "Iman ceramico com a paisagem da Ribeira do Porto e a Ponte D. Luis I.",
    categoryHandle: "imanes-ceramicos",
    status: "published",
    weight: 30,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
    ],
    variants: [
      { title: "Unidade", sku: "IM-PORT-1", options: { Embalagem: "Unidade" }, price: 4 },
      { title: "Pack 6", sku: "IM-PORT-6", options: { Embalagem: "Pack 6" }, price: 20 },
    ],
  },
  {
    handle: "iman-fado",
    title: "Iman Fado",
    description: "Iman ceramico com cena de Fado, representando a alma musical portuguesa.",
    categoryHandle: "imanes-ceramicos",
    status: "published",
    weight: 25,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
    ],
    variants: [
      { title: "Unidade", sku: "IM-FADO-1", options: { Embalagem: "Unidade" }, price: 3 },
      { title: "Pack 6", sku: "IM-FADO-6", options: { Embalagem: "Pack 6" }, price: 15 },
    ],
  },
  {
    handle: "iman-pastel-de-nata",
    title: "Iman Pastel de Nata",
    description: "Iman ceramico em forma de pastel de nata, o doce mais famoso de Portugal.",
    categoryHandle: "imanes-ceramicos",
    collectionHandles: ["novidades"],
    status: "published",
    weight: 20,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6", "Pack 12"] },
    ],
    variants: [
      { title: "Unidade", sku: "IM-NATA-1", options: { Embalagem: "Unidade" }, price: 3 },
      { title: "Pack 6", sku: "IM-NATA-6", options: { Embalagem: "Pack 6" }, price: 15 },
      { title: "Pack 12", sku: "IM-NATA-12", options: { Embalagem: "Pack 12" }, price: 27 },
    ],
  },
  {
    handle: "iman-eletrico-28",
    title: "Iman Eletrico 28",
    description: "Iman ceramico com o famoso eletrico 28 de Lisboa, simbolo do transporte historico da cidade.",
    categoryHandle: "imanes-ceramicos",
    status: "published",
    weight: 30,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
    ],
    variants: [
      { title: "Unidade", sku: "IM-ELET-1", options: { Embalagem: "Unidade" }, price: 4 },
      { title: "Pack 6", sku: "IM-ELET-6", options: { Embalagem: "Pack 6" }, price: 20 },
    ],
  },
  {
    handle: "iman-bacalhau",
    title: "Iman Bacalhau",
    description: "Iman ceramico em forma de bacalhau, o ingrediente mais emblemático da gastronomia portuguesa.",
    categoryHandle: "imanes-ceramicos",
    collectionHandles: ["novidades"],
    status: "published",
    weight: 25,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
    ],
    variants: [
      { title: "Unidade", sku: "IM-BAC-1", options: { Embalagem: "Unidade" }, price: 3 },
      { title: "Pack 6", sku: "IM-BAC-6", options: { Embalagem: "Pack 6" }, price: 15 },
    ],
  },
];

// --- Porta-Copos (10 products) ---
const portaCopos: ProductDef[] = [
  {
    handle: "porta-copos-azulejo-classico",
    title: "Porta-Copos Azulejo Classico",
    description: "Porta-copos ceramico com padrao de azulejo classico portugues. Base em cortica natural.",
    categoryHandle: "porta-copos",
    collectionHandles: ["destaques"],
    status: "published",
    weight: 100,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
      { title: "Acabamento", values: ["Brilhante", "Mate"] },
    ],
    variants: [
      { title: "Unidade / Brilhante", sku: "PC-CLASS-1-BR", options: { Embalagem: "Unidade", Acabamento: "Brilhante" }, price: 5 },
      { title: "Pack 6 / Brilhante", sku: "PC-CLASS-6-BR", options: { Embalagem: "Pack 6", Acabamento: "Brilhante" }, price: 25 },
      { title: "Unidade / Mate", sku: "PC-CLASS-1-MT", options: { Embalagem: "Unidade", Acabamento: "Mate" }, price: 5 },
      { title: "Pack 6 / Mate", sku: "PC-CLASS-6-MT", options: { Embalagem: "Pack 6", Acabamento: "Mate" }, price: 25 },
    ],
  },
  {
    handle: "porta-copos-geometrico",
    title: "Porta-Copos Geometrico",
    description: "Porta-copos com padroes geometricos modernos inspirados na azulejaria portuguesa.",
    categoryHandle: "porta-copos",
    collectionHandles: ["novidades"],
    status: "published",
    weight: 100,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
      { title: "Design", values: ["Azul Tradicional", "Multicolor"] },
    ],
    variants: [
      { title: "Unidade / Azul", sku: "PC-GEO-1-AT", options: { Embalagem: "Unidade", Design: "Azul Tradicional" }, price: 5 },
      { title: "Pack 6 / Azul", sku: "PC-GEO-6-AT", options: { Embalagem: "Pack 6", Design: "Azul Tradicional" }, price: 25 },
      { title: "Unidade / Multicolor", sku: "PC-GEO-1-MC", options: { Embalagem: "Unidade", Design: "Multicolor" }, price: 6 },
      { title: "Pack 6 / Multicolor", sku: "PC-GEO-6-MC", options: { Embalagem: "Pack 6", Design: "Multicolor" }, price: 30 },
    ],
  },
  {
    handle: "porta-copos-floral",
    title: "Porta-Copos Floral",
    description: "Porta-copos com motivos florais delicados. Perfeito para mesas elegantes.",
    categoryHandle: "porta-copos",
    status: "published",
    weight: 100,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
    ],
    variants: [
      { title: "Unidade", sku: "PC-FLOR-1", options: { Embalagem: "Unidade" }, price: 4 },
      { title: "Pack 6", sku: "PC-FLOR-6", options: { Embalagem: "Pack 6" }, price: 20 },
    ],
  },
  {
    handle: "porta-copos-maritimo",
    title: "Porta-Copos Maritimo",
    description: "Porta-copos com tematica maritima portuguesa. Conchas, peixes e ondas em ceramica.",
    categoryHandle: "porta-copos",
    status: "published",
    weight: 100,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
      { title: "Acabamento", values: ["Brilhante", "Mate"] },
    ],
    variants: [
      { title: "Unidade / Brilhante", sku: "PC-MAR-1-BR", options: { Embalagem: "Unidade", Acabamento: "Brilhante" }, price: 5 },
      { title: "Pack 6 / Brilhante", sku: "PC-MAR-6-BR", options: { Embalagem: "Pack 6", Acabamento: "Brilhante" }, price: 25 },
      { title: "Unidade / Mate", sku: "PC-MAR-1-MT", options: { Embalagem: "Unidade", Acabamento: "Mate" }, price: 5 },
      { title: "Pack 6 / Mate", sku: "PC-MAR-6-MT", options: { Embalagem: "Pack 6", Acabamento: "Mate" }, price: 25 },
    ],
  },
  {
    handle: "porta-copos-lisboa",
    title: "Porta-Copos Lisboa",
    description: "Porta-copos com vistas iconicas de Lisboa. Cada peca do pack apresenta um monumento diferente.",
    categoryHandle: "porta-copos",
    collectionHandles: ["destaques"],
    status: "published",
    weight: 100,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
    ],
    variants: [
      { title: "Unidade", sku: "PC-LISB-1", options: { Embalagem: "Unidade" }, price: 5 },
      { title: "Pack 6", sku: "PC-LISB-6", options: { Embalagem: "Pack 6" }, price: 25 },
    ],
  },
  {
    handle: "porta-copos-porto",
    title: "Porta-Copos Porto",
    description: "Porta-copos com paisagens do Porto. Ribeira, caves do vinho e a Ponte D. Luis.",
    categoryHandle: "porta-copos",
    status: "published",
    weight: 100,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
    ],
    variants: [
      { title: "Unidade", sku: "PC-PORT-1", options: { Embalagem: "Unidade" }, price: 5 },
      { title: "Pack 6", sku: "PC-PORT-6", options: { Embalagem: "Pack 6" }, price: 25 },
    ],
  },
  {
    handle: "porta-copos-algarve",
    title: "Porta-Copos Algarve",
    description: "Porta-copos com motivos do Algarve: falesias, barcos e azulejos tipicos da regiao.",
    categoryHandle: "porta-copos",
    status: "published",
    weight: 100,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
      { title: "Acabamento", values: ["Brilhante", "Mate"] },
    ],
    variants: [
      { title: "Unidade / Brilhante", sku: "PC-ALG-1-BR", options: { Embalagem: "Unidade", Acabamento: "Brilhante" }, price: 5 },
      { title: "Pack 6 / Brilhante", sku: "PC-ALG-6-BR", options: { Embalagem: "Pack 6", Acabamento: "Brilhante" }, price: 25 },
      { title: "Pack 6 / Mate", sku: "PC-ALG-6-MT", options: { Embalagem: "Pack 6", Acabamento: "Mate" }, price: 25 },
    ],
  },
  {
    handle: "porta-copos-minho",
    title: "Porta-Copos Minho",
    description: "Porta-copos com bordados e padroes tipicos do Minho. Cores vibrantes e alegres.",
    categoryHandle: "porta-copos",
    status: "published",
    weight: 100,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
    ],
    variants: [
      { title: "Unidade", sku: "PC-MIN-1", options: { Embalagem: "Unidade" }, price: 4 },
      { title: "Pack 6", sku: "PC-MIN-6", options: { Embalagem: "Pack 6" }, price: 20 },
    ],
  },
  {
    handle: "porta-copos-moderno",
    title: "Porta-Copos Moderno",
    description: "Porta-copos com design contemporaneo minimalista. Linhas limpas e acabamento premium.",
    categoryHandle: "porta-copos",
    status: "draft",
    weight: 100,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
    ],
    variants: [
      { title: "Unidade", sku: "PC-MOD-1", options: { Embalagem: "Unidade" }, price: 6 },
      { title: "Pack 6", sku: "PC-MOD-6", options: { Embalagem: "Pack 6" }, price: 30 },
    ],
  },
  {
    handle: "porta-copos-premium",
    title: "Porta-Copos Premium",
    description: "Porta-copos de alta qualidade com detalhes dourados e base em cortica premium. Ideal para hotelaria.",
    categoryHandle: "porta-copos",
    collectionHandles: ["edicao-limitada"],
    status: "published",
    weight: 120,
    options: [
      { title: "Embalagem", values: ["Unidade", "Pack 6"] },
      { title: "Acabamento", values: ["Brilhante", "Mate"] },
    ],
    variants: [
      { title: "Unidade / Brilhante", sku: "PC-PREM-1-BR", options: { Embalagem: "Unidade", Acabamento: "Brilhante" }, price: 8 },
      { title: "Pack 6 / Brilhante", sku: "PC-PREM-6-BR", options: { Embalagem: "Pack 6", Acabamento: "Brilhante" }, price: 42 },
      { title: "Unidade / Mate", sku: "PC-PREM-1-MT", options: { Embalagem: "Unidade", Acabamento: "Mate" }, price: 8 },
      { title: "Pack 6 / Mate", sku: "PC-PREM-6-MT", options: { Embalagem: "Pack 6", Acabamento: "Mate" }, price: 42 },
    ],
  },
];

// --- Paineis de Azulejos (10 products) ---
const paineis: ProductDef[] = [
  {
    handle: "painel-lisboa-panoramica",
    title: "Painel Lisboa Panoramica",
    description: "Painel de azulejos com vista panoramica de Lisboa. Composicao de multiplos azulejos que formam uma imagem unica.",
    categoryHandle: "paineis-de-azulejos",
    collectionHandles: ["destaques"],
    status: "published",
    weight: 2000,
    options: [
      { title: "Tamanho", values: ["Medio", "Grande"] },
    ],
    variants: [
      { title: "Medio (6 azulejos)", sku: "PA-LISB-M", options: { Tamanho: "Medio" }, price: 35 },
      { title: "Grande (12 azulejos)", sku: "PA-LISB-G", options: { Tamanho: "Grande" }, price: 50 },
    ],
  },
  {
    handle: "painel-ponte-d-luis",
    title: "Painel Ponte D. Luis",
    description: "Painel representando a iconica Ponte D. Luis I no Porto, obra de engenharia do seculo XIX.",
    categoryHandle: "paineis-de-azulejos",
    collectionHandles: ["destaques"],
    status: "published",
    weight: 2000,
    options: [
      { title: "Tamanho", values: ["Medio", "Grande"] },
    ],
    variants: [
      { title: "Medio (6 azulejos)", sku: "PA-PONT-M", options: { Tamanho: "Medio" }, price: 35 },
      { title: "Grande (12 azulejos)", sku: "PA-PONT-G", options: { Tamanho: "Grande" }, price: 50 },
    ],
  },
  {
    handle: "painel-fado",
    title: "Painel Fado",
    description: "Painel artistico retratando uma casa de Fado, com fadista, guitarra portuguesa e ouvintes emocionados.",
    categoryHandle: "paineis-de-azulejos",
    collectionHandles: ["novidades"],
    status: "published",
    weight: 2000,
    options: [
      { title: "Tamanho", values: ["Medio", "Grande"] },
    ],
    variants: [
      { title: "Medio (6 azulejos)", sku: "PA-FADO-M", options: { Tamanho: "Medio" }, price: 38 },
      { title: "Grande (12 azulejos)", sku: "PA-FADO-G", options: { Tamanho: "Grande" }, price: 50 },
    ],
  },
  {
    handle: "painel-galo",
    title: "Painel Galo de Barcelos",
    description: "Painel decorativo com o Galo de Barcelos em grande formato. Cores tradicionais vibrantes.",
    categoryHandle: "paineis-de-azulejos",
    status: "published",
    weight: 1800,
    options: [
      { title: "Tamanho", values: ["Medio", "Grande"] },
    ],
    variants: [
      { title: "Medio (6 azulejos)", sku: "PA-GALO-M", options: { Tamanho: "Medio" }, price: 32 },
      { title: "Grande (12 azulejos)", sku: "PA-GALO-G", options: { Tamanho: "Grande" }, price: 48 },
    ],
  },
  {
    handle: "painel-mar-portugues",
    title: "Painel Mar Portugues",
    description: "Painel com tematica dos Descobrimentos: caravelas, mapa-mundi e rosas-dos-ventos em azul e branco.",
    categoryHandle: "paineis-de-azulejos",
    collectionHandles: ["edicao-limitada"],
    status: "published",
    weight: 2200,
    options: [
      { title: "Tamanho", values: ["Medio", "Grande"] },
    ],
    variants: [
      { title: "Medio (6 azulejos)", sku: "PA-MAR-M", options: { Tamanho: "Medio" }, price: 40 },
      { title: "Grande (12 azulejos)", sku: "PA-MAR-G", options: { Tamanho: "Grande" }, price: 50 },
    ],
  },
  {
    handle: "painel-sardinhada",
    title: "Painel Sardinhada",
    description: "Painel colorido com sardinhas em festa, celebrando os Santos Populares. Alegre e vibrante.",
    categoryHandle: "paineis-de-azulejos",
    status: "published",
    weight: 1800,
    options: [
      { title: "Tamanho", values: ["Medio", "Grande"] },
    ],
    variants: [
      { title: "Medio (6 azulejos)", sku: "PA-SARD-M", options: { Tamanho: "Medio" }, price: 30 },
      { title: "Grande (12 azulejos)", sku: "PA-SARD-G", options: { Tamanho: "Grande" }, price: 45 },
    ],
  },
  {
    handle: "painel-alfama",
    title: "Painel Alfama",
    description: "Painel com as ruelas e escadarias do bairro de Alfama em Lisboa. Atmosfera tipica e nostalgica.",
    categoryHandle: "paineis-de-azulejos",
    status: "published",
    weight: 2000,
    options: [
      { title: "Tamanho", values: ["Medio", "Grande"] },
    ],
    variants: [
      { title: "Medio (6 azulejos)", sku: "PA-ALFA-M", options: { Tamanho: "Medio" }, price: 35 },
      { title: "Grande (12 azulejos)", sku: "PA-ALFA-G", options: { Tamanho: "Grande" }, price: 50 },
    ],
  },
  {
    handle: "painel-ribeira-porto",
    title: "Painel Ribeira do Porto",
    description: "Painel com a Ribeira do Porto, patrimonio mundial da UNESCO. Barcos rabelos e casas coloridas.",
    categoryHandle: "paineis-de-azulejos",
    status: "published",
    weight: 2000,
    options: [
      { title: "Tamanho", values: ["Medio", "Grande"] },
    ],
    variants: [
      { title: "Medio (6 azulejos)", sku: "PA-RIB-M", options: { Tamanho: "Medio" }, price: 35 },
      { title: "Grande (12 azulejos)", sku: "PA-RIB-G", options: { Tamanho: "Grande" }, price: 50 },
    ],
  },
  {
    handle: "painel-sintra",
    title: "Painel Sintra",
    description: "Painel com o Palacio da Pena em Sintra, rodeado de vegetacao exuberante. Cores romanticas.",
    categoryHandle: "paineis-de-azulejos",
    status: "published",
    weight: 2000,
    options: [
      { title: "Tamanho", values: ["Medio", "Grande"] },
    ],
    variants: [
      { title: "Medio (6 azulejos)", sku: "PA-SINT-M", options: { Tamanho: "Medio" }, price: 38 },
      { title: "Grande (12 azulejos)", sku: "PA-SINT-G", options: { Tamanho: "Grande" }, price: 50 },
    ],
  },
  {
    handle: "painel-algarve",
    title: "Painel Algarve",
    description: "Painel com as falesias douradas e grutas do Algarve. Mar turquesa e paisagem de tirar o folego.",
    categoryHandle: "paineis-de-azulejos",
    status: "published",
    weight: 2000,
    options: [
      { title: "Tamanho", values: ["Medio", "Grande"] },
    ],
    variants: [
      { title: "Medio (6 azulejos)", sku: "PA-ALG-M", options: { Tamanho: "Medio" }, price: 35 },
      { title: "Grande (12 azulejos)", sku: "PA-ALG-G", options: { Tamanho: "Grande" }, price: 50 },
    ],
  },
];

const ALL_PRODUCTS = [...azulejos, ...imanes, ...portaCopos, ...paineis];

// ---------------------------------------------------------------------------
// Company / Employee / Customer data
// ---------------------------------------------------------------------------
const COMPANY_DATA = [
  {
    company: {
      name: "Ceramica do Algarve, Lda",
      email: "geral@ceramicadoalgarve.pt",
      phone: "+351 289 123 456",
      vat: "PT509876543",
      address: "Rua dos Oleiros, 15",
      city: "Faro",
      state: "Faro",
      zip: "8000-123",
      country: "PT",
      logo_url: null,
      currency_code: "eur",
      verified: true,
      spending_limit_reset_frequency: "monthly" as const,
    },
    customerGroupName: "Revendedores",
    employees: [
      { email: "admin@ceramicadoalgarve.pt", firstName: "Ana", lastName: "Santos", isAdmin: true, spendingLimit: 0 },
      { email: "joao@ceramicadoalgarve.pt", firstName: "Joao", lastName: "Silva", isAdmin: false, spendingLimit: 500 },
      { email: "maria@ceramicadoalgarve.pt", firstName: "Maria", lastName: "Costa", isAdmin: false, spendingLimit: 200 },
      { email: "pedro@ceramicadoalgarve.pt", firstName: "Pedro", lastName: "Oliveira", isAdmin: false, spendingLimit: 100 },
    ],
  },
  {
    company: {
      name: "Hotel Maritimo",
      email: "compras@hotelmaritimo.pt",
      phone: "+351 213 456 789",
      vat: "PT501234567",
      address: "Avenida da Liberdade, 200",
      city: "Lisboa",
      state: "Lisboa",
      zip: "1250-100",
      country: "PT",
      logo_url: null,
      currency_code: "eur",
      verified: true,
      spending_limit_reset_frequency: "monthly" as const,
    },
    customerGroupName: "Hotelaria",
    employees: [
      { email: "admin@hotelmaritimo.pt", firstName: "Carlos", lastName: "Ferreira", isAdmin: true, spendingLimit: 0 },
    ],
  },
  {
    company: {
      name: "Artesanato do Minho",
      email: "info@artesanatodominho.pt",
      phone: "+351 253 789 012",
      vat: "PT506543210",
      address: "Largo do Toural, 8",
      city: "Guimaraes",
      state: "Braga",
      zip: "4800-200",
      country: "PT",
      logo_url: null,
      currency_code: "eur",
      verified: false,
      spending_limit_reset_frequency: "monthly" as const,
    },
    customerGroupName: null,
    employees: [
      { email: "admin@artesanatodominho.pt", firstName: "Teresa", lastName: "Mendes", isAdmin: true, spendingLimit: 0 },
    ],
  },
];

const TEST_PASSWORD = "Test1234!";

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
export default async function seedB2BData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  logger.info("=== Rio Gaia B2B Seed: Starting ===");

  // Phase 1: Core Infrastructure
  const infra = await seedCoreInfrastructure(container, logger);
  if (!infra) {
    logger.error("Core infrastructure failed. Aborting seed.");
    return;
  }

  // Phase 2: Product Categories
  const categoryMap = await seedCategories(container, logger);

  // Phase 3: Collections
  const collectionMap = await seedCollections(container, logger);

  // Phase 4: Products
  const variantMap = await seedProducts(container, logger, infra.salesChannelId, categoryMap, collectionMap);

  // Phase 5: Customer Groups
  const groupMap = await seedCustomerGroups(container, logger);

  // Phase 6: Customer Accounts + Auth
  const customerMap = await seedCustomerAccounts(container, logger);

  // Phase 7: Companies
  const companyMap = await seedCompanies(container, logger);

  // Phase 8: Link Companies to Customer Groups
  await seedCompanyGroupLinks(container, logger, companyMap, groupMap);

  // Phase 9: Employees
  await seedEmployees(container, logger, companyMap, customerMap);

  // Phase 10: Admin User + Carts + Quotes
  await seedQuotes(container, logger, infra, customerMap, companyMap, variantMap);

  logger.info("=== Rio Gaia B2B Seed: Complete ===");
}

// ---------------------------------------------------------------------------
// Phase 1: Core Infrastructure
// ---------------------------------------------------------------------------
async function seedCoreInfrastructure(container: any, logger: any) {
  try {
    logger.info("Phase 1: Seeding core infrastructure...");

    const link = container.resolve(ContainerRegistrationKeys.LINK);
    const fulfillmentModuleService: IFulfillmentModuleService = container.resolve(
      ModuleRegistrationName.FULFILLMENT
    );
    const salesChannelModuleService: ISalesChannelModuleService = container.resolve(
      ModuleRegistrationName.SALES_CHANNEL
    );
    const storeModuleService: IStoreModuleService = container.resolve(
      ModuleRegistrationName.STORE
    );

    // Store
    const [store] = await storeModuleService.listStores();
    let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    });

    if (!defaultSalesChannel.length) {
      const { result } = await createSalesChannelsWorkflow(container).run({
        input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
      });
      defaultSalesChannel = result;
    }

    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: [{ currency_code: "eur", is_default: true }],
          default_sales_channel_id: defaultSalesChannel[0].id,
        },
      },
    });

    // Region
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { data: existingRegions } = await query.graph({
      entity: "region",
      fields: ["id", "name"],
      filters: { name: "Portugal" },
    });

    let regionId: string;
    if (existingRegions.length > 0) {
      regionId = existingRegions[0].id;
      logger.info("Region 'Portugal' already exists, skipping.");
    } else {
      const { result: regionResult } = await createRegionsWorkflow(container).run({
        input: {
          regions: [
            { name: "Portugal", currency_code: "eur", countries: ["pt"], payment_providers: ["pp_system_default"] },
          ],
        },
      });
      regionId = regionResult[0].id;
    }

    // Tax
    const { data: existingTaxRegions } = await query.graph({
      entity: "tax_region",
      fields: ["id", "country_code"],
      filters: { country_code: "pt" },
    });

    if (existingTaxRegions.length === 0) {
      await createTaxRegionsWorkflow(container).run({
        input: [{
          country_code: "pt",
          provider_id: "tp_system",
          default_tax_rate: {
            rate: 23,
            code: "IVA-PT",
            name: "IVA Portugal",
          },
        }],
      });
    } else {
      logger.info("Tax region 'pt' already exists, skipping.");
    }

    // Stock Location
    const { data: existingLocations } = await query.graph({
      entity: "stock_location",
      fields: ["id", "name"],
      filters: { name: "Armazem Rio Gaia" },
    });

    let stockLocationId: string;
    if (existingLocations.length > 0) {
      stockLocationId = existingLocations[0].id;
      logger.info("Stock location 'Armazem Rio Gaia' already exists, skipping.");
    } else {
      const { result: stockResult } = await createStockLocationsWorkflow(container).run({
        input: {
          locations: [
            {
              name: "Armazem Rio Gaia",
              address: { city: "Vila Nova de Gaia", country_code: "pt", address_1: "Rua da Ceramica, 42" },
            },
          ],
        },
      });
      stockLocationId = stockResult[0].id;

      await link.create({
        [Modules.STOCK_LOCATION]: { stock_location_id: stockLocationId },
        [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
      });
    }

    // Fulfillment
    const existingFulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({
      name: "Armazem Rio Gaia - Entregas",
    });

    let fulfillmentSet: any;
    if (existingFulfillmentSets.length > 0) {
      fulfillmentSet = existingFulfillmentSets[0];
      logger.info("Fulfillment set already exists, skipping.");
    } else {
      fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
        name: "Armazem Rio Gaia - Entregas",
        type: "shipping",
        service_zones: [
          {
            name: "Portugal",
            geo_zones: [{ country_code: "pt", type: "country" }],
          },
        ],
      });

      await link.create({
        [Modules.STOCK_LOCATION]: { stock_location_id: stockLocationId },
        [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
      });
    }

    // Shipping Profile
    const existingProfiles = await fulfillmentModuleService.listShippingProfiles({
      name: "Default",
    });

    let shippingProfileId: string;
    if (existingProfiles.length > 0) {
      shippingProfileId = existingProfiles[0].id;
      logger.info("Shipping profile 'Default' already exists, skipping.");
    } else {
      const { result: profileResult } = await createShippingProfilesWorkflow(container).run({
        input: { data: [{ name: "Default", type: "default" }] },
      });
      shippingProfileId = profileResult[0].id;
    }

    // Shipping Options
    const existingOptions = await fulfillmentModuleService.listShippingOptions({
      name: "Envio Standard",
    });

    if (existingOptions.length === 0) {
      const serviceZoneId = fulfillmentSet.service_zones[0].id;
      await createShippingOptionsWorkflow(container).run({
        input: [
          {
            name: "Envio Standard",
            price_type: "flat",
            provider_id: "manual_manual",
            service_zone_id: serviceZoneId,
            shipping_profile_id: shippingProfileId,
            type: { label: "Standard", description: "Entrega em 2-3 dias uteis.", code: "standard" },
            prices: [
              { currency_code: "eur", amount: 5 },
              { region_id: regionId, amount: 5 },
            ],
            rules: [
              { attribute: "enabled_in_store", value: '"true"', operator: "eq" },
              { attribute: "is_return", value: "false", operator: "eq" },
            ],
          },
          {
            name: "Envio Expresso",
            price_type: "flat",
            provider_id: "manual_manual",
            service_zone_id: serviceZoneId,
            shipping_profile_id: shippingProfileId,
            type: { label: "Expresso", description: "Entrega em 24 horas.", code: "express" },
            prices: [
              { currency_code: "eur", amount: 12 },
              { region_id: regionId, amount: 12 },
            ],
            rules: [
              { attribute: "enabled_in_store", value: '"true"', operator: "eq" },
              { attribute: "is_return", value: "false", operator: "eq" },
            ],
          },
        ],
      });
    } else {
      logger.info("Shipping options already exist, skipping.");
    }

    // Sales Channel <-> Stock Location
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: stockLocationId, add: [defaultSalesChannel[0].id] },
    });

    // API Key
    const { data: existingKeys } = await query.graph({
      entity: "api_key",
      fields: ["id", "title"],
      filters: { title: "Webshop" },
    });

    let publishableApiKeyId: string;
    if (existingKeys.length > 0) {
      publishableApiKeyId = existingKeys[0].id;
      logger.info("API key 'Webshop' already exists, skipping.");
    } else {
      const { result: keyResult } = await createApiKeysWorkflow(container).run({
        input: { api_keys: [{ title: "Webshop", type: "publishable", created_by: "" }] },
      });
      publishableApiKeyId = keyResult[0].id;
    }

    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: { id: publishableApiKeyId, add: [defaultSalesChannel[0].id] },
    });

    logger.info("Phase 1: Complete.");
    return {
      regionId,
      salesChannelId: defaultSalesChannel[0].id,
      stockLocationId,
    };
  } catch (error: any) {
    logger.error(`Phase 1 failed: ${error.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Phase 2: Product Categories
// ---------------------------------------------------------------------------
async function seedCategories(container: any, logger: any): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    logger.info("Phase 2: Seeding product categories...");
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const categoryDefs = [
      { name: "Azulejos Decorativos", handle: "azulejos-decorativos", is_active: true },
      { name: "Imanes Ceramicos", handle: "imanes-ceramicos", is_active: true },
      { name: "Porta-Copos", handle: "porta-copos", is_active: true },
      { name: "Paineis de Azulejos", handle: "paineis-de-azulejos", is_active: true },
    ];

    const toCreate: typeof categoryDefs = [];
    for (const cat of categoryDefs) {
      const { data } = await query.graph({
        entity: "product_category",
        fields: ["id", "handle"],
        filters: { handle: cat.handle },
      });
      if (data.length > 0) {
        map.set(cat.handle, data[0].id);
        logger.info(`Category "${cat.name}" already exists.`);
      } else {
        toCreate.push(cat);
      }
    }

    if (toCreate.length > 0) {
      const { result } = await createProductCategoriesWorkflow(container).run({
        input: { product_categories: toCreate },
      });
      for (const cat of result) {
        map.set(cat.handle, cat.id);
      }
    }

    logger.info(`Phase 2: Complete. ${map.size} categories ready.`);
  } catch (error: any) {
    logger.error(`Phase 2 failed: ${error.message}`);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Phase 3: Collections
// ---------------------------------------------------------------------------
async function seedCollections(container: any, logger: any): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    logger.info("Phase 3: Seeding collections...");
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const collectionDefs = [
      { title: "Destaques", handle: "destaques" },
      { title: "Novidades", handle: "novidades" },
      { title: "Edicao Limitada", handle: "edicao-limitada" },
    ];

    for (const col of collectionDefs) {
      const { data } = await query.graph({
        entity: "product_collection",
        fields: ["id", "handle"],
        filters: { handle: col.handle },
      });
      if (data.length > 0) {
        map.set(col.handle, data[0].id);
        logger.info(`Collection "${col.title}" already exists.`);
      } else {
        const { result } = await createCollectionsWorkflow(container).run({
          input: { collections: [col] },
        });
        map.set(col.handle, result[0].id);
      }
    }

    logger.info(`Phase 3: Complete. ${map.size} collections ready.`);
  } catch (error: any) {
    logger.error(`Phase 3 failed: ${error.message}`);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Phase 4: Products
// ---------------------------------------------------------------------------
async function seedProducts(
  container: any,
  logger: any,
  salesChannelId: string,
  categoryMap: Map<string, string>,
  collectionMap: Map<string, string>
): Promise<Map<string, string>> {
  // Maps product handle -> first variant ID (used for quote carts)
  const variantMap = new Map<string, string>();
  try {
    logger.info("Phase 4: Seeding products...");
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    let created = 0;
    let skipped = 0;

    // Process in batches of 5
    for (let i = 0; i < ALL_PRODUCTS.length; i += 5) {
      const batch = ALL_PRODUCTS.slice(i, i + 5);
      const toCreate: any[] = [];

      for (const p of batch) {
        const { data } = await query.graph({
          entity: "product",
          fields: ["id", "handle", "variants.id"],
          filters: { handle: p.handle },
        });
        if (data.length > 0) {
          if (data[0].variants?.length > 0) {
            variantMap.set(p.handle, data[0].variants[0].id);
          }
          skipped++;
          continue;
        }

        const categoryId = categoryMap.get(p.categoryHandle);
        const collectionId = p.collectionHandles?.[0]
          ? collectionMap.get(p.collectionHandles[0])
          : undefined;

        toCreate.push({
          title: p.title,
          handle: p.handle,
          description: p.description,
          weight: p.weight,
          status: p.status === "published" ? ProductStatus.PUBLISHED : ProductStatus.DRAFT,
          images: [
            { url: img(p.title.replace(/ /g, "+"), i) },
            { url: img(p.title.replace(/ /g, "+"), i + 1) },
          ],
          ...(categoryId ? { category_ids: [categoryId] } : {}),
          ...(collectionId ? { collection_id: collectionId } : {}),
          options: p.options,
          variants: p.variants.map((v) => ({
            title: v.title,
            sku: v.sku,
            options: v.options,
            manage_inventory: false,
            prices: [{ amount: v.price, currency_code: "eur" }],
          })),
          sales_channels: [{ id: salesChannelId }],
        });
      }

      if (toCreate.length > 0) {
        const { result } = await createProductsWorkflow(container).run({
          input: { products: toCreate },
        });
        for (const product of result) {
          if (product.variants?.length > 0) {
            variantMap.set(product.handle, product.variants[0].id);
          }
        }
        created += toCreate.length;
      }
    }

    logger.info(`Phase 4: Complete. ${created} created, ${skipped} skipped. ${variantMap.size} products tracked.`);
  } catch (error: any) {
    logger.error(`Phase 4 failed: ${error.message}`);
  }
  return variantMap;
}

// ---------------------------------------------------------------------------
// Phase 5: Customer Groups
// ---------------------------------------------------------------------------
async function seedCustomerGroups(container: any, logger: any): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    logger.info("Phase 5: Seeding customer groups...");
    const customerModuleService: ICustomerModuleService = container.resolve(
      ModuleRegistrationName.CUSTOMER
    );

    for (const name of ["Revendedores", "Hotelaria"]) {
      const existing = await customerModuleService.listCustomerGroups({ name });
      if (existing.length > 0) {
        map.set(name, existing[0].id);
        logger.info(`Customer group "${name}" already exists.`);
      } else {
        const group = await customerModuleService.createCustomerGroups({ name });
        map.set(name, group.id);
      }
    }

    logger.info(`Phase 5: Complete. ${map.size} groups ready.`);
  } catch (error: any) {
    logger.error(`Phase 5 failed: ${error.message}`);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Phase 6: Customer Accounts + Auth
// ---------------------------------------------------------------------------
async function seedCustomerAccounts(container: any, logger: any): Promise<Map<string, string>> {
  // Maps email -> customer_id
  const map = new Map<string, string>();
  try {
    logger.info("Phase 6: Seeding customer accounts...");
    const customerModuleService: ICustomerModuleService = container.resolve(
      ModuleRegistrationName.CUSTOMER
    );
    const authModuleService: IAuthModuleService = container.resolve(Modules.AUTH);
    const hashConfig = { logN: 15, r: 8, p: 1 };

    for (const companyDef of COMPANY_DATA) {
      for (const emp of companyDef.employees) {
        // Check if customer exists
        const existing = await customerModuleService.listCustomers({ email: emp.email });
        if (existing.length > 0) {
          map.set(emp.email, existing[0].id);
          logger.info(`Customer "${emp.email}" already exists.`);
          continue;
        }

        // Create customer (has_account: true matches the standard registration flow)
        const customer = await customerModuleService.createCustomers({
          first_name: emp.firstName,
          last_name: emp.lastName,
          email: emp.email,
          has_account: true,
        });
        map.set(emp.email, customer.id);

        // Create auth identity
        const passwordHash = await Scrypt.kdf(TEST_PASSWORD, hashConfig);
        await authModuleService.createAuthIdentities({
          provider_identities: [
            {
              provider: "emailpass",
              entity_id: emp.email,
              provider_metadata: {
                password: passwordHash.toString("base64"),
              },
            },
          ],
          app_metadata: {
            customer_id: customer.id,
          },
        });

        logger.info(`Created customer + auth: ${emp.email}`);
      }
    }

    logger.info(`Phase 6: Complete. ${map.size} customer accounts ready.`);
  } catch (error: any) {
    logger.error(`Phase 6 failed: ${error.message}`);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Phase 7: Companies
// ---------------------------------------------------------------------------
async function seedCompanies(container: any, logger: any): Promise<Map<string, string>> {
  // Maps company name -> company_id
  const map = new Map<string, string>();
  try {
    logger.info("Phase 7: Seeding companies...");
    const companyModuleService: ICompanyModuleService = container.resolve(COMPANY_MODULE);

    for (const def of COMPANY_DATA) {
      const existing = await companyModuleService.listCompanies({
        q: def.company.name,
      });
      const exactMatch = existing.find((c: any) => c.name === def.company.name);
      if (exactMatch) {
        map.set(def.company.name, exactMatch.id);
        logger.info(`Company "${def.company.name}" already exists.`);
        continue;
      }

      const { result } = await createCompaniesWorkflow(container).run({
        input: [def.company as any],
      });
      map.set(def.company.name, result[0].id);
      logger.info(`Created company: ${def.company.name}`);
    }

    logger.info(`Phase 7: Complete. ${map.size} companies ready.`);
  } catch (error: any) {
    logger.error(`Phase 7 failed: ${error.message}`);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Phase 8: Link Companies to Customer Groups
// ---------------------------------------------------------------------------
async function seedCompanyGroupLinks(
  container: any,
  logger: any,
  companyMap: Map<string, string>,
  groupMap: Map<string, string>
) {
  try {
    logger.info("Phase 8: Linking companies to customer groups...");

    for (const def of COMPANY_DATA) {
      if (!def.customerGroupName) continue;

      const companyId = companyMap.get(def.company.name);
      const groupId = groupMap.get(def.customerGroupName);
      if (!companyId || !groupId) {
        logger.warn(`Skipping link for "${def.company.name}": missing company or group ID.`);
        continue;
      }

      try {
        await addCompanyToCustomerGroupWorkflow(container).run({
          input: { company_id: companyId, group_id: groupId },
        });
        logger.info(`Linked "${def.company.name}" -> "${def.customerGroupName}"`);
      } catch (err: any) {
        // May fail if link already exists — that's okay (v2.13.4 changed the error message)
        if (
          err.message?.includes("already exists") ||
          err.message?.includes("Cannot create multiple links")
        ) {
          logger.info(`Link "${def.company.name}" -> "${def.customerGroupName}" already exists.`);
        } else {
          throw err;
        }
      }
    }

    logger.info("Phase 8: Complete.");
  } catch (error: any) {
    logger.error(`Phase 8 failed: ${error.message}`);
  }
}

// ---------------------------------------------------------------------------
// Phase 9: Employees
// ---------------------------------------------------------------------------
async function seedEmployees(
  container: any,
  logger: any,
  companyMap: Map<string, string>,
  customerMap: Map<string, string>
) {
  try {
    logger.info("Phase 9: Seeding employees...");
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    for (const def of COMPANY_DATA) {
      const companyId = companyMap.get(def.company.name);
      if (!companyId) {
        logger.warn(`Skipping employees for "${def.company.name}": company not found.`);
        continue;
      }

      // Check existing employees for this company (using query.graph to populate customer link)
      const { data: existingEmployees } = await query.graph({
        entity: "employee",
        fields: ["id", "spending_limit", "is_admin", "customer.*"],
        filters: { company_id: companyId },
      });

      for (const emp of def.employees) {
        const customerId = customerMap.get(emp.email);
        if (!customerId) {
          logger.warn(`Skipping employee "${emp.email}": customer not found.`);
          continue;
        }

        // Check if this employee already exists by matching the linked customer email
        if (existingEmployees.length > 0) {
          const alreadyExists = existingEmployees.some(
            (e: any) => e.customer?.email === emp.email
          );
          if (alreadyExists) {
            logger.info(`Employee "${emp.email}" already exists for "${def.company.name}".`);
            continue;
          }
        }

        try {
          await createEmployeesWorkflow(container).run({
            input: {
              employeeData: {
                company_id: companyId,
                customer_id: customerId,
                spending_limit: emp.spendingLimit,
                is_admin: emp.isAdmin,
              },
              customerId,
            },
          });
          logger.info(`Created employee: ${emp.email} (${emp.isAdmin ? "admin" : "employee"}, limit: ${emp.spendingLimit || "unlimited"})`);
        } catch (err: any) {
          // May fail if employee link already exists (v2.13.4 changed the error message)
          if (err.message?.includes("Cannot create multiple links")) {
            logger.info(`Employee "${emp.email}" already linked for "${def.company.name}".`);
          } else {
            logger.warn(`Could not create employee "${emp.email}": ${err.message}`);
          }
        }
      }
    }

    logger.info("Phase 9: Complete.");
  } catch (error: any) {
    logger.error(`Phase 9 failed: ${error.message}`);
  }
}

// ---------------------------------------------------------------------------
// Phase 10: Admin User + Carts + Quotes
// ---------------------------------------------------------------------------
async function seedQuotes(
  container: any,
  logger: any,
  infra: { regionId: string; salesChannelId: string },
  customerMap: Map<string, string>,
  companyMap: Map<string, string>,
  variantMap: Map<string, string>
) {
  try {
    logger.info("Phase 10: Seeding admin user, carts, and quotes...");

    // --- Admin user for quote messages ---
    const userModuleService: IUserModuleService = container.resolve(Modules.USER);
    const authModuleService: IAuthModuleService = container.resolve(Modules.AUTH);

    const existingAdmins = await userModuleService.listUsers({ email: "admin@riogaia.pt" });
    let adminUserId: string;
    if (existingAdmins.length > 0) {
      adminUserId = existingAdmins[0].id;
      logger.info("Admin user already exists.");
    } else {
      const adminUser = await userModuleService.createUsers({
        first_name: "Rio Gaia",
        last_name: "Admin",
        email: "admin@riogaia.pt",
      });
      adminUserId = adminUser.id;

      const hashConfig = { logN: 15, r: 8, p: 1 };
      const passwordHash = await Scrypt.kdf(TEST_PASSWORD, hashConfig);
      await authModuleService.createAuthIdentities({
        provider_identities: [
          {
            provider: "emailpass",
            entity_id: "admin@riogaia.pt",
            provider_metadata: { password: passwordHash.toString("base64") },
          },
        ],
        app_metadata: { user_id: adminUserId },
      });
      logger.info("Created admin user: admin@riogaia.pt");
    }

    // Check if quotes already exist
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { data: existingQuotes } = await query.graph({
      entity: "quote",
      fields: ["id"],
    });
    if (existingQuotes.length > 0) {
      logger.info(`${existingQuotes.length} quotes already exist. Skipping quote seeding.`);
      logger.info("Phase 10: Complete.");
      return;
    }

    // Need variant IDs for cart items
    if (variantMap.size === 0) {
      logger.warn("No variant IDs available. Skipping quote seeding.");
      logger.info("Phase 10: Complete.");
      return;
    }

    // Helper to pick variant IDs
    const pickVariant = (handle: string): string | null => variantMap.get(handle) || null;

    // --- Quote 1: Pending Merchant ---
    const ceramicaId = companyMap.get("Ceramica do Algarve, Lda");
    const anaCustId = customerMap.get("admin@ceramicadoalgarve.pt");

    if (ceramicaId && anaCustId) {
      try {
        const items = [
          pickVariant("azulejo-tradicional-portugues"),
          pickVariant("azulejo-flor-de-lisboa"),
          pickVariant("azulejo-galo-de-barcelos"),
        ].filter(Boolean).map((vid) => ({ variant_id: vid!, quantity: 10 }));

        if (items.length > 0) {
          const { result: cart1 } = await createCartWorkflow(container).run({
            input: {
              region_id: infra.regionId,
              sales_channel_id: infra.salesChannelId,
              currency_code: "eur",
              customer_id: anaCustId,
              email: "admin@ceramicadoalgarve.pt",
              items,
              metadata: { company_id: ceramicaId },
              shipping_address: {
                first_name: "Ana", last_name: "Santos",
                address_1: "Rua dos Oleiros, 15", city: "Faro",
                country_code: "pt", postal_code: "8000-123",
              },
            },
          });

          const { result: q1 } = await createRequestForQuoteWorkflow(container).run({
            input: { cart_id: cart1.id, customer_id: anaCustId },
          });

          await createQuoteMessageWorkflow(container).run({
            input: {
              text: "Gostavamos de obter um orcamento para estes azulejos para a nossa loja no Algarve. Precisamos de pelo menos 10 unidades de cada modelo.",
              quote_id: q1.quote.id,
              customer_id: anaCustId,
            },
          });

          logger.info("Quote 1 (pending_merchant) created.");
        }
      } catch (err: any) {
        logger.warn(`Quote 1 failed: ${err.message}`);
      }
    }

    // --- Quote 2: Pending Customer ---
    const joaoCustId = customerMap.get("joao@ceramicadoalgarve.pt");

    if (ceramicaId && joaoCustId) {
      try {
        const items = [
          pickVariant("iman-azulejo-classico"),
          pickVariant("iman-galo-barcelos"),
        ].filter(Boolean).map((vid) => ({ variant_id: vid!, quantity: 24 }));

        if (items.length > 0) {
          const { result: cart2 } = await createCartWorkflow(container).run({
            input: {
              region_id: infra.regionId,
              sales_channel_id: infra.salesChannelId,
              currency_code: "eur",
              customer_id: joaoCustId,
              email: "joao@ceramicadoalgarve.pt",
              items,
              metadata: { company_id: ceramicaId },
              shipping_address: {
                first_name: "Joao", last_name: "Silva",
                address_1: "Rua dos Oleiros, 15", city: "Faro",
                country_code: "pt", postal_code: "8000-123",
              },
            },
          });

          const { result: q2 } = await createRequestForQuoteWorkflow(container).run({
            input: { cart_id: cart2.id, customer_id: joaoCustId },
          });

          await createQuoteMessageWorkflow(container).run({
            input: {
              text: "Precisamos de uma encomenda grande de imanes para a epoca turistica. Seria possivel um desconto para quantidade?",
              quote_id: q2.quote.id,
              customer_id: joaoCustId,
            },
          });

          await createQuoteMessageWorkflow(container).run({
            input: {
              text: "Obrigado pelo contacto. Para encomendas acima de 20 unidades, podemos oferecer 15% de desconto. Enviamos o orcamento atualizado.",
              quote_id: q2.quote.id,
              admin_id: adminUserId,
            },
          });

          await merchantSendQuoteWorkflow(container).run({
            input: { quote_id: q2.quote.id },
          });

          logger.info("Quote 2 (pending_customer) created.");
        }
      } catch (err: any) {
        logger.warn(`Quote 2 failed: ${err.message}`);
      }
    }

    // --- Quote 3: Accepted ---
    const hotelId = companyMap.get("Hotel Maritimo");
    const carlosCustId = customerMap.get("admin@hotelmaritimo.pt");

    if (hotelId && carlosCustId) {
      try {
        const items = [
          pickVariant("porta-copos-premium"),
          pickVariant("porta-copos-lisboa"),
          pickVariant("painel-lisboa-panoramica"),
          pickVariant("painel-alfama"),
        ].filter(Boolean).map((vid) => ({ variant_id: vid!, quantity: 5 }));

        if (items.length > 0) {
          const { result: cart3 } = await createCartWorkflow(container).run({
            input: {
              region_id: infra.regionId,
              sales_channel_id: infra.salesChannelId,
              currency_code: "eur",
              customer_id: carlosCustId,
              email: "admin@hotelmaritimo.pt",
              items,
              metadata: { company_id: hotelId },
              shipping_address: {
                first_name: "Carlos", last_name: "Ferreira",
                address_1: "Avenida da Liberdade, 200", city: "Lisboa",
                country_code: "pt", postal_code: "1250-100",
              },
            },
          });

          const { result: q3 } = await createRequestForQuoteWorkflow(container).run({
            input: { cart_id: cart3.id, customer_id: carlosCustId },
          });

          await createQuoteMessageWorkflow(container).run({
            input: {
              text: "Gostavamos de decorar os quartos do hotel com porta-copos e paineis de azulejos. Podemos agendar uma entrega?",
              quote_id: q3.quote.id,
              customer_id: carlosCustId,
            },
          });

          await createQuoteMessageWorkflow(container).run({
            input: {
              text: "Com certeza! O orcamento esta pronto. Podemos agendar a entrega apos confirmacao. Obrigado pela preferencia.",
              quote_id: q3.quote.id,
              admin_id: adminUserId,
            },
          });

          await merchantSendQuoteWorkflow(container).run({
            input: { quote_id: q3.quote.id },
          });

          await customerAcceptQuoteWorkflow(container).run({
            input: { quote_id: q3.quote.id, customer_id: carlosCustId },
          });

          logger.info("Quote 3 (accepted) created.");
        }
      } catch (err: any) {
        logger.warn(`Quote 3 failed: ${err.message}`);
      }
    }

    // --- Quote 4: Customer Rejected ---
    const mariaCustId = customerMap.get("maria@ceramicadoalgarve.pt");

    if (ceramicaId && mariaCustId) {
      try {
        const panelVariant = pickVariant("painel-mar-portugues");
        if (panelVariant) {
          const { result: cart4 } = await createCartWorkflow(container).run({
            input: {
              region_id: infra.regionId,
              sales_channel_id: infra.salesChannelId,
              currency_code: "eur",
              customer_id: mariaCustId,
              email: "maria@ceramicadoalgarve.pt",
              items: [{ variant_id: panelVariant, quantity: 2 }],
              metadata: { company_id: ceramicaId },
              shipping_address: {
                first_name: "Maria", last_name: "Costa",
                address_1: "Rua dos Oleiros, 15", city: "Faro",
                country_code: "pt", postal_code: "8000-123",
              },
            },
          });

          const { result: q4 } = await createRequestForQuoteWorkflow(container).run({
            input: { cart_id: cart4.id, customer_id: mariaCustId },
          });

          await createQuoteMessageWorkflow(container).run({
            input: {
              text: "Infelizmente o valor ultrapassa o nosso orcamento actual. Voltaremos a contactar no proximo trimestre.",
              quote_id: q4.quote.id,
              customer_id: mariaCustId,
            },
          });

          await merchantSendQuoteWorkflow(container).run({
            input: { quote_id: q4.quote.id },
          });

          await customerRejectQuoteWorkflow(container).run({
            input: { quote_id: q4.quote.id },
          });

          logger.info("Quote 4 (customer_rejected) created.");
        }
      } catch (err: any) {
        logger.warn(`Quote 4 failed: ${err.message}`);
      }
    }

    logger.info("Phase 10: Complete.");
  } catch (error: any) {
    logger.error(`Phase 10 failed: ${error.message}`);
  }
}
