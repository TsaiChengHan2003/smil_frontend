import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const { webCode } = useParams();

  const handleResetPassword = (e) => {
    e.preventDefault();
    toast.info("密碼重設功能開發中...");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">重設密碼</h2>
          <p className="text-muted text-center mb-4">
            重設代碼: <strong>{webCode}</strong>
          </p>
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">新密碼</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">確認密碼</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              重設密碼
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

