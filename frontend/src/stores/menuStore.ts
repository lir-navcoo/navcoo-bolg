import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MenuItem {
  id: string
  name: string
  nameEn: string
  url: string
  order: number
  enabled: boolean
}

interface MenuState {
  menus: MenuItem[]
  setMenus: (menus: MenuItem[]) => void
  addMenu: (menu: Omit<MenuItem, 'id'>) => void
  updateMenu: (id: string, menu: Partial<MenuItem>) => void
  deleteMenu: (id: string) => void
  reorderMenu: (id: string, newOrder: number) => void
  getEnabledMenus: () => MenuItem[]
}

const defaultMenus: MenuItem[] = [
  { id: 'home', name: '首页', nameEn: 'Home', url: '/', order: 1, enabled: true },
  { id: 'articles', name: '文章', nameEn: 'Articles', url: '/articles', order: 2, enabled: true },
  { id: 'tech', name: '技术', nameEn: 'Tech', url: '/category/技术', order: 3, enabled: true },
  { id: 'life', name: '生活', nameEn: 'Life', url: '/category/生活', order: 4, enabled: true },
  { id: 'essay', name: '随笔', nameEn: 'Essay', url: '/category/随笔', order: 5, enabled: true },
]

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      menus: defaultMenus,
      
      setMenus: (menus) => set({ menus }),
      
      addMenu: (menu) => {
        const newMenu: MenuItem = {
          ...menu,
          id: `menu-${Date.now()}`,
        }
        set((state) => ({
          menus: [...state.menus, newMenu].sort((a, b) => a.order - b.order),
        }))
      },
      
      updateMenu: (id, updates) => {
        set((state) => ({
          menus: state.menus.map((menu) =>
            menu.id === id ? { ...menu, ...updates } : menu
          ),
        }))
      },
      
      deleteMenu: (id) => {
        set((state) => ({
          menus: state.menus.filter((menu) => menu.id !== id),
        }))
      },
      
      reorderMenu: (id, newOrder) => {
        set((state) => {
          const menu = state.menus.find((m) => m.id === id)
          if (!menu) return state
          
          const otherMenus = state.menus.filter((m) => m.id !== id)
          const updatedMenu = { ...menu, order: newOrder }
          
          const newMenus = [...otherMenus, updatedMenu]
            .sort((a, b) => a.order - b.order)
            .map((m, index) => ({ ...m, order: index + 1 }))
          
          return { menus: newMenus }
        })
      },
      
      getEnabledMenus: () => {
        return get().menus.filter((m) => m.enabled).sort((a, b) => a.order - b.order)
      },
    }),
    {
      name: 'blog-menus',
    }
  )
)
