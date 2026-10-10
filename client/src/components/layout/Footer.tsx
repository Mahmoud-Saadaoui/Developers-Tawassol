export default function Footer() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 24,
        color: '#888',
        borderTop: '1px solid #f0f0f0',
      }}
    >
      © {new Date().getFullYear()} Tawassol
    </div>
  );
}
