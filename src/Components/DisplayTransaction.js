import ShowMoreText from "react-show-more-text";
import ReceiptOutlined from "@material-ui/icons/ReceiptOutlined";
import { Statistic } from "antd";
import "../assets/css/TransactionCard.css";
import moment from "moment";

function DisplayTransaction({ details, userName }) {
  const validateImageUrl = (url) => url.includes("bahi-book.appspot.com");

  return (
    <div className="trans__card">
      <p className="trans__time">
        {moment(details?.timestamp?._seconds * 1000).format('DD/MM/YY, HH:mm')}
      </p>
      <p className="trans__by">
        By: {details?.by === userName ? "You" : details?.by}
      </p>
      <div className="trans__details">
        <Statistic
          className={
            details.amount >= 0
              ? "positive trans__amount"
              : "negative trans__amount"
          }
          value={Math.abs(details.amount)}
        />
        {validateImageUrl(details.receipt) && (
          <a rel="noreferrer" href={details.receipt} target="_blank">
            <ReceiptOutlined className="trans__receipt" />
          </a>
        )}
        {details.desc !== "" && (
          <ShowMoreText
            className={
              details.receipt === "" ? "noreceipt trans__desc" : "trans__desc"
            }
            lines={2}
            more="More"
            less="Less"
            anchorClass="trans__desc"
            expanded={false}
          >
            {details.desc}
          </ShowMoreText>
        )}
      </div>
    </div>
  );
}

export default DisplayTransaction;
