// ErrorBoundary.tsx
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorPopup from "../errorPopup";

type Props = {
  errorMessage?: string;
  onError?: (error: Error) => void;
  children: React.ReactNode;
  fallbackRender?: (props: { error: Error }) => React.ReactNode;
};

export default function ErrorBoundary({ errorMessage, onError, children, fallbackRender }: Props) {
  const defaultFallbackRender = (props: { error: Error }) => (
    <ErrorPopup error={errorMessage || props.error.message} />
  );
  return (
    <ReactErrorBoundary
      onError={(error) => onError?.(error)}
      fallbackRender={fallbackRender || defaultFallbackRender}
    >
      {children}
    </ReactErrorBoundary>
  );
}