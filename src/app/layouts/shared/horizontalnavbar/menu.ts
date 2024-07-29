import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'ri-dashboard-line',
        link: '/'
    },
    {
        id: 58,
        label: 'MENUITEMS.PAGES.TEXT',
        icon: 'ri-file-copy-2-line',
        subItems: [
            {
                id: 59,
                label: 'MENUITEMS.AUTHENTICATION.TEXT',
                icon: 'ri-account-circle-line',
                subItems: [
                    {
                        id: 60,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN',
                        link: '/pages/login-1',
                        parentId: 59
                    },
                    {
                        id: 61,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER',
                        link: '/pages/register-1',
                        parentId: 59
                    },
                    {
                        id: 62,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD',
                        link: '/pages/recoverpwd-1',
                        parentId: 59
                    },
                    {
                        id: 63,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
                        link: '/pages/lock-screen-1',
                        parentId: 59
                    }
                ]
            },
            {
                id: 64,
                label: 'MENUITEMS.UTILITY.TEXT',
                icon: 'ri-profile-line',
                subItems: [
                    {
                        id: 65,
                        label: 'MENUITEMS.UTILITY.LIST.STARTER',
                        link: '/pages/starter',
                        parentId: 64
                    },
                    {
                        id: 66,
                        label: 'MENUITEMS.UTILITY.LIST.MAINTENANCE',
                        link: '/pages/maintenance',
                        parentId: 64
                    },
                    {
                        id: 67,
                        label: 'MENUITEMS.UTILITY.LIST.COOMINGSOON',
                        link: '/pages/coming-soon',
                        parentId: 64
                    },
                    {
                        id: 68,
                        label: 'MENUITEMS.UTILITY.LIST.TIMELINE',
                        link: '/pages/timeline',
                        parentId: 64
                    },
                    {
                        id: 69,
                        label: 'MENUITEMS.UTILITY.LIST.FAQS',
                        link: '/pages/faqs',
                        parentId: 64
                    },
                    {
                        id: 70,
                        label: 'MENUITEMS.UTILITY.LIST.PRICING',
                        link: '/pages/pricing',
                        parentId: 64
                    },
                    {
                        id: 71,
                        label: 'MENUITEMS.UTILITY.LIST.ERROR404',
                        link: '/pages/404',
                        parentId: 64
                    },
                    {
                        id: 72,
                        label: 'MENUITEMS.UTILITY.LIST.ERROR500',
                        link: '/pages/500',
                        parentId: 64
                    },
                ]
            },
        ]
    }
];

