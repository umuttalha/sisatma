import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  activeTab,
  onTabChange
}) => {
  const [active, setActive] = useState(activeTab || propTabs[0]?.value);
  const [tabs, setTabs] = useState(propTabs);
  const [hovering, setHovering] = useState(false);

  // Update active tab when prop changes (from routing)
  useEffect(() => {
    if (activeTab && activeTab !== active) {
      setActive(activeTab);
      // Reorder tabs to put active one on top
      const activeTabData = propTabs.find(tab => tab.value === activeTab);
      const otherTabs = propTabs.filter(tab => tab.value !== activeTab);
      if (activeTabData) {
        setTabs([activeTabData, ...otherTabs]);
      }
    }
  }, [activeTab, propTabs]);

  const moveSelectedTabToTop = (clickedTab) => {
    const newTabs = [clickedTab, ...propTabs.filter(tab => tab.value !== clickedTab.value)];
    setTabs(newTabs);
    setActive(clickedTab.value);
    
    // Call the routing handler
    if (onTabChange) {
      onTabChange(clickedTab.value);
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full mb-8",
          containerClassName
        )}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {propTabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => moveSelectedTabToTop(tab)}
            className={cn("relative px-4 py-2 rounded-full", tabClassName)}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {active === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full",
                  activeTabClassName
                )}
              />
            )}

            <span className="relative block text-black dark:text-white">
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      
      {/* Card stack visualization */}
      <div 
        className="relative w-full h-60 [perspective:1000px]"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {tabs.map((tab, idx) => (
          <motion.div
            key={tab.value}
            className={cn(
              "absolute inset-0 w-full h-full rounded-2xl border border-neutral-200 dark:border-neutral-700 cursor-pointer",
              "bg-white dark:bg-neutral-900 shadow-xl"
            )}
            style={{
              transformStyle: "preserve-3d",
            }}
            animate={{
              rotateX: hovering ? idx * -5 : 0,
              z: hovering ? idx * -50 : idx * -10,
              y: idx * 4,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            onClick={() => moveSelectedTabToTop(tab)}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                {tab.title}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                Click to navigate to {tab.title.toLowerCase()} page
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
