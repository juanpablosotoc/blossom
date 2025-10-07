import React from "react";
import styles from "./styles.module.css";
import ErrorBoundary from "@/components/errorBoundary";

type Props = React.PropsWithChildren<{ title?: string }>;

export default function BigUl({ title, children }: Props) {
  const [currentBar, setCurrentBar] = React.useState(0);

  // Normalize & filter children to valid elements only
  const items = React.useMemo(
    () =>
      React.Children.toArray(children)
        .filter(React.isValidElement), // drop strings/whitespace/nulls
    [children]
  );

  return (
    <ErrorBoundary errorMessage="Error in BigUl component" onError={(e)=>console.error(e)}>
      <div className={styles.sequence}>
        {title && <h3 className={styles.title}>{title}</h3>}
        <div className={styles.content}>
          {items.map((child, index) => {
            const isActive = currentBar === index;
            const isPrev = index < currentBar;

            return (
              <div
                key={(child as any).key ?? index} // stable key
                className={[
                  styles.innerWrapper,
                  isActive ? styles.active : "",
                  isPrev ? styles.prevActive : "",
                ].join(" ").trim()}
              >
                <button
                  type="button"
                  className={styles.bar}
                  onClick={() => setCurrentBar(index)}
                  aria-pressed={isActive}
                  aria-label={`Show item ${index + 1}`}
                />
                <div className={styles.sequencewrapper} data-is-parent>
                  {child}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
}