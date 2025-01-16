'use client'
// import type { Metadata } from 'next'
// import './globals.css'
import React, { useState } from 'react'
import styles from './style.module.css'
import {  Plus, X } from 'lucide-react'
import ModalManager from '@/components/_modals/modalManager'
import Link from 'next/link'

interface Tab {
  id: number
  title: string
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>)
 {

      const [tabs, setTabs] = useState<Tab[]>([
        { id: 1, title: 'New Tab 1', },
      ])
      const [activeTab, setActiveTab] = useState<number>(1)

      const addTab = (): void => {
        const newTab: Tab = {
          id: tabs.length + 1,
          title: `New  ${tabs.length + 1}`,
        }
        setTabs([...tabs, newTab])
        setActiveTab(newTab.id)
      }

      const closeTab = (id: number): void => {
        const updatedTabs = tabs.filter((tab) => tab.id !== id)
        setTabs(updatedTabs)
        if (activeTab === id && updatedTabs.length > 0) {
          setActiveTab(updatedTabs[0].id)
        }
      }
   
  return (
    <>
      <div className="bg-[#e8e8e8] text-white rounded-t-md shadow-md">
        {/* Tab Headers */}
        <div className="flex items-center justify-between pt-2 h-[46px]  px-2 bg-[#e8e8e8]">
          <div className="flex items-center ">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex justify-between items-center w-[220px]  text-black  ${
                  tab.id === activeTab
                    ? styles['rounded-tab']
                    : `bg-[#e8e8e8] border-r-2 border-separate border-gray-400 p-2 hover:bg-gray-300 hover:rounded-lg hover:h-8  h-4 `
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.title}</span>
                <span
                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                >
                  ×
                </span>
              </div>
            ))}
            <button
              className="  text-white w-5 rounded-full  h-5 text-sm bg-blue-600  flex items-center"
              onClick={addTab}
            >
              <Plus />
            </button>
          </div>
          <Link
            href={'/'}
            className="  text-white w-6 rounded-full  h-6 text-sm bg-gray-500  flex items-center"
          >
            <X />
          </Link>
    
        </div>

        {/* Tab Content */}
        <div className="pt-4 bg-white text-black border-b">
          {tabs.map(
            (tab) =>
              tab.id === activeTab && (
                <div key={tab.id} className="animate-fade-in">
                  <div className="bg-[#fff] h-full">{children}</div>
                </div>
              )
          )}
        </div>
      </div>

      <ModalManager />
    </>
  )
}
