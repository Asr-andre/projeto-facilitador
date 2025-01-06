import { MenuItem } from "./menu.model";

  const getIdUsuario = (): string | null => localStorage.getItem('id_usuario');

  // Função para construir o menu com base no id_usuario
  const buildMenu = (): MenuItem[] => {
  const idUsuario = getIdUsuario();

  return [
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
      id: 3,
      label: "MENUITEMS.CARTEIRADECLIENTES.TEXT",
      icon: "fas fa-list-alt",
      link: "/carteira-de-clientes",
    },
    {
      id: 4,
      label: "MENUITEMS.CHAT.TEXT",
      icon: "ri-chat-1-line",
      link: "/chat",
    },
    {
      id: 5,
      label: "MENUITEMS.CADASTRO.TEXT",
      icon: "ri-user-add-line",
      subItems: [
        {
          id: 1,
          label: "MENUITEMS.CADASTRO.LIST.CONTRATANTES",
          link: "/cadastro/contratantes",
          parentId: 5,
        },
        {
          id: 2,
          label: "MENUITEMS.CADASTRO.LIST.CLIENTE",
          link: "/cadastro/cliente",
          parentId: 5,
        },
        {
          id: 3,
          label: "MENUITEMS.CADASTRO.LIST.TITULOS",
          link: "/cadastro/titulos",
          parentId: 5,
        },
        {
          id: 4,
          label: "MENUITEMS.CADASTRO.LIST.EMPRESA",
          link: "/cadastro/empresa",
          parentId: 5,
          show: idUsuario === '"1"'
        },
        {
          id: 5,
          label: "MENUITEMS.CADASTRO.LIST.EMAIL-CONTA",
          link: "/cadastro/email-conta",
          parentId: 5,
        },
        {
          id: 6,
          label: "MENUITEMS.CADASTRO.LIST.EMAIL-PERFIL",
          link: "/cadastro/email-perfil",
          parentId: 5,
        },
        {
          id: 7,
          label: "MENUITEMS.CADASTRO.LIST.FORMULA",
          link: "/cadastro/formula",
          parentId: 5,
        },
        {
          id: 8,
          label: "MENUITEMS.CADASTRO.LIST.INDICE",
          link: "/cadastro/indice",
          parentId: 5,
        },
        {
          id: 9,
          label: "MENUITEMS.CADASTRO.LIST.SMS",
          link: "/cadastro/sms",
          parentId: 5,
        },
        {
          id: 10,
          label: "MENUITEMS.CADASTRO.LIST.SMS-WHATSAPP",
          link: "/cadastro/sms-whatsapp",
          parentId: 5,
        },
        {
          id: 11,
          label: "MENUITEMS.CADASTRO.LIST.USUARIOS",
          link: "/cadastro/usuarios",
          parentId: 5,
        },
      ].filter(item => item.show !== false), // Filtra subItems para remover aqueles com show === false
    },
    {
      id: 6,
      label: "MENUITEMS.FILA.TEXT",
      icon: "fas fa-tasks",
      link: "/fila",
    },
    {
      id: 7,
      label: "MENUITEMS.RELATORIOS.TEXT",
      icon: "ri-file-chart-line",
      subItems: [
        {
          id: 1,
          label: "MENUITEMS.RELATORIOS.LIST.DASHBOARD",
          link: "/relatorios/dashboard",
          parentId: 7,
        },
        {
          id: 2,
          label: "MENUITEMS.RELATORIOS.LIST.FINANCEIRO",
          link: "/relatorios/financeiro",
          parentId: 7,
        },
        {
          id: 3,
          label: "MENUITEMS.RELATORIOS.LIST.LOGS",
          link: "/relatorios/logs",
          parentId: 7,
        },
      ],
    },
    {
      id: 8,
      label: "MENUITEMS.PROCESSAMENTOS.TEXT",
      icon: "ri-settings-3-line",
      subItems: [
        {
          id: 1,
          label: "MENUITEMS.PROCESSAMENTOS.LIST.IMPORTACAO",
          link: "/processamentos/importacao",
          parentId: 8,
        },
      ],
    },
  ];
};

export const MENU: MenuItem[] = buildMenu();
