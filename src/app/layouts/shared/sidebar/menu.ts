import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: "MENUITEMS.DASHBOARDS.TEXT",
    icon: "ri-dashboard-line",
    link: "/",
  },
  {
    id: 2,
    label: "MENUITEMS.CARTEIRADECLIENTES.TEXT",
    icon: "fas fa-list-alt",
    link: "/carteira-de-clientes",
  },
  {
    id: 2,
    label: "MENUITEMS.FILA.TEXT",
    icon: "fas fa-tasks",
    link: "/fila",
  },
  {
    id: 8,
    label: "MENUITEMS.CADASTRO.TEXT",
    icon: "ri-user-add-line",
    subItems: [
      {
        id: 9,
        label: "MENUITEMS.CADASTRO.LIST.EMPRESA",
        link: "/cadastro/empresa",
        parentId: 8,
      },
      {
        id: 10,
        label: "MENUITEMS.CADASTRO.LIST.CONTRATANTES",
        link: "/cadastro/contratantes",
        parentId: 8,
      },
      {
        id: 11,
        label: "MENUITEMS.CADASTRO.LIST.USUARIOS",
        link: "/cadastro/usuarios",
        parentId: 8,
      },
      {
        id: 12,
        label: "MENUITEMS.CADASTRO.LIST.CLIENTES",
        link: "/cadastro/clientes",
        parentId: 8,
      },
      {
        id: 13,
        label: "MENUITEMS.CADASTRO.LIST.TITULOS",
        link: "/cadastro/titulos",
        parentId: 8,
      },
    ],
  },
  {
    id: 14,
    label: "MENUITEMS.RELATORIOS.TEXT",
    icon: "ri-file-chart-line",
    subItems: [
      {
        id: 15,
        label: "MENUITEMS.RELATORIOS.LIST.DASHBOARD",
        link: "/relatorios/dashboard",
        parentId: 14,
      },
      {
        id: 16,
        label: "MENUITEMS.RELATORIOS.LIST.FINANCEIRO",
        link: "/relatorios/financeiro",
        parentId: 14,
      },
    ],
  },
  {
    id: 17,
    label: "MENUITEMS.PROCESSAMENTOS.TEXT",
    icon: "ri-settings-3-line",
    subItems: [
      {
        id: 18,
        label: "MENUITEMS.PROCESSAMENTOS.LIST.IMPORTACAO",
        link: "/processamentos/importacao",
        parentId: 17,
      },
    ],
  },
];
