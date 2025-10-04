// Search.tsx
import general from '../general.module.scss';
import styles from './styles.module.scss';
import First from './first';
import Second from './second';
import SideCircles from '../sideCircles';
import { useEffect, useRef, useState } from 'react';
import { createWebview } from '@/utils/webview';
import { isValidUrl } from './utils';
import { Node } from '@/utils/treeTypes';
import { createEmptyGrid, insertNode } from "@myUtils/tree"; // <-- import insertNode

interface Props { isActive: boolean };

function Search({ isActive }: Props) {
  const [tree, setTree] = useState<Node[][]>(() => {
    const grid = createEmptyGrid();
    // (your sample seeding can stay or be removed)
    return grid;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCircle, setActiveCircle] = useState(0);

  const dummyUrls: string[] = [];
  const [tabOrder, setTabOrder] = useState<string[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const tabsRef = useRef<Map<string, Electron.WebviewTag>>(new Map());

  const onCreateDir = (row: number, col: number, name: string) => {
    setTree(prev => {
      // guard: only create if currently empty
      if (prev[row][col].type !== "empty") return prev;

      const next = prev.map(r => r.slice());
      next[row][col] = {
        id: `dir-${crypto.randomUUID?.() || Date.now()}`,
        type: "dir",
        title: name,
        children: [],
      };
      return next;
    });
  };

  useEffect(() => {
    if (tabOrder.length) return;
    const ids: string[] = [];
    dummyUrls.forEach((url, i) => {
      const id = `tab-${i}`;
      const wv = createWebview(url, id);
      tabsRef.current.set(id, wv);
      ids.push(id);
      document.getElementById("webview-stash")?.appendChild(wv);
    });
    setTabOrder(ids);
    setActiveTabId(ids[0] ?? null);
  }, []);

  const setSearchQuery = (query: string) => {
    const nextUrl = isValidUrl(query)
      ? query
      : `https://www.google.com/search?q=${query.replace(/ /g, "+")}`;

    // 1) Create/activate a webview tab (unchanged)
    const id = `tab-${crypto.randomUUID?.() || Date.now()}`;
    const wv = createWebview(nextUrl, id);
    document.getElementById("webview-stash")?.appendChild(wv);
    tabsRef.current.set(id, wv);
    setTabOrder(prev => [...prev, id]);
    setActiveTabId(id);

    // 2) Insert a Leaf node into the 5x5 tree (root level)
    const u = new URL(nextUrl);
    const newNode: Node = {
      id,                         // reuse same id as the webview tab
      type: "open",
      title: u.hostname.replace(/^www\./, ""),
      favicon: `${u.origin}/favicon.ico`,
      thumbnail: undefined,       // set if you have a preview
    };

    setTree(prev => {
      const res = insertNode(prev, newNode);
      if (!res.ok) {
        console.warn("Tree is full, could not insert new tab");
        return prev;
      }
      // Optional: you could store res.location to focus/select the newly created cell
      return res.tree;
    });
  };

  useEffect(() => {
    if (activeTabId && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [activeTabId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let ticking = false;
    const updateActive = () => {
      const { scrollTop, clientHeight } = container;
      const viewportCenter = scrollTop + clientHeight / 2;
      let closestIdx = 0;
      let minDist = Infinity;
      const children = Array.from(container.children) as HTMLElement[];
      for (let i = 0; i < children.length; i++) {
        const el = children[i];
        const center = el.offsetTop + el.offsetHeight / 2;
        const dist = Math.abs(viewportCenter - center);
        if (dist < minDist) { minDist = dist; closestIdx = i; }
      }
      setActiveCircle(closestIdx);
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { updateActive(); ticking = false; });
        ticking = true;
      }
    };
    updateActive();
    container.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => updateActive();
    window.addEventListener("resize", onResize);
    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`${general.window} ${styles.container} ${isActive ? general.active : ''}`}>
      <SideCircles circleCount={2} activeCircle={activeCircle} isActive={isActive && activeTabId !== null}/>
      <div className={styles.wrapper} ref={containerRef}>
        <div className={styles.firstWrapper}>
          <First setSearchQuery={setSearchQuery} tree={tree} setActiveTabId={setActiveTabId} onCreateDir={onCreateDir} />
        </div>
        {activeTabId && (
          <div className={styles.secondWrapper}>
            <Second webview={tabsRef.current.get(activeTabId)!} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;