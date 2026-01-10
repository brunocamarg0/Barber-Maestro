import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const type = searchParams.get("type");

    if (token && type) {
      // Salvar token
      localStorage.setItem("token", token);
      localStorage.setItem("userType", type);

      // Redirecionar baseado no tipo
      if (type === "cliente") {
        navigate("/cliente", { replace: true });
      } else if (type === "dono") {
        navigate("/dono", { replace: true });
      } else if (type === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

