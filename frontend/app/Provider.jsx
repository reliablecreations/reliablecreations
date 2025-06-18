"use client";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
export default function Providers({ children }) {
  // const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
