import { ImageResponse } from "next/og"

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = "image/png"

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: "#22d3ee", // cyan-400
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                    borderRadius: "8px", // rounded-lg equivalent for 32px
                }}
            >
                {/* Simple SVG representation of the Bot icon since we can't import lucide-react here directly in some Next.js versions for edge, 
            but we can use standard SVG elements. Or just a simple shape. 
            Let's try to replicate the Bot icon shape roughly or use a character if simpler. 
            Actually, we can use SVG paths. */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
