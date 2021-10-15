import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import "../assets/css/CustomerCard.css";

function CustomerLoadingCard() {
  return (
    <div style={{ padding: "10px 10px" }} className="customer__card">
      <Typography style={{ marginTop: "-10px" }} variant="h3">
        <Skeleton width={"75%"} />
      </Typography>
      <Typography variant="caption">
        <Skeleton width={"50%"} />
      </Typography>
    </div>
  );
}

export default CustomerLoadingCard;
