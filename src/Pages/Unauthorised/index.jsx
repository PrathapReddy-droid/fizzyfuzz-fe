// Pages/Unauthorized.jsx
const Unauthorized = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">🚫 Access Denied</h1>
        <p className="mt-2 text-gray-600">
          You are not authorized to access this page.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
