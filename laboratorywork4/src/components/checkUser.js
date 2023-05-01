import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserCheck(props) {
  const { Comp, qId } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user-info")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Comp qId={qId} />
    </div>
  );
}

export default UserCheck;
