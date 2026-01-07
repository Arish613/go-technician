import { Phone } from "lucide-react";

export function StickyContactButtons() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        zIndex: 1000,
      }}
    >
      <a
        href="https://wa.me/917977661546"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: "#25D366",
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "28px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        aria-label="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M16.001 2.003c-7.732 0-14.003 6.271-14.003 14.003 0 2.737.786 5.283 2.142 7.438L2 30l6.72-2.092a13.94 13.94 0 0 0 7.281 2.091h.001c7.731 0 14.002-6.271 14.002-14.003S23.732 2.003 16.001 2.003zm0 25.53a11.5 11.5 0 0 1-5.868-1.606l-.42-.249-3.986 1.24 1.303-3.885-.274-.401a11.49 11.49 0 1 1 9.245 4.901zm6.315-8.64c-.344-.173-2.035-1.003-2.351-1.118-.315-.115-.545-.173-.774.173-.229.344-.888 1.118-1.089 1.347-.201.229-.401.258-.745.086-.344-.173-1.453-.536-2.768-1.707-1.023-.912-1.714-2.037-1.915-2.381-.201-.344-.021-.53.151-.702.155-.154.344-.401.516-.602.173-.201.229-.344.344-.573.115-.229.057-.43-.029-.602-.086-.173-.774-1.863-1.06-2.553-.279-.67-.562-.579-.774-.59-.201-.01-.43-.012-.659-.012s-.602.086-.917.43c-.315.344-1.203 1.175-1.203 2.868 0 1.693 1.232 3.328 1.404 3.558.173.229 2.424 3.702 5.874 5.194.821.354 1.461.566 1.96.725.823.262 1.573.225 2.165.137.661-.099 2.035-.831 2.322-1.635.287-.803.287-1.491.201-1.635-.086-.144-.315-.229-.659-.401z" />
        </svg>
      </a>
      <a
        href="tel:+917977661546"
        style={{
          background: "#0A66C2",
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "26px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        aria-label="Call us"
      >
        <Phone />
      </a>
    </div>
  );
}
