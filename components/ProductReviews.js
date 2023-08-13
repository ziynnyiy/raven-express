import styled from "styled-components";
import Input from "./Input";
import WhiteBox from "./WhiteBox";
import StarsRating from "./StarsRating";
import Textarea from "./Textarea";
import Button from "./Button";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 5px;
`;
const Subtitle = styled.h3`
  font-size: 1rem;
  margin-top: 5px;
`;
const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
`;
const ReviewWrapper = styled.div`
  margin-bottom: 10px;
  border-top: 1px solid #eee;
  padding: 10px 0;
  h3 {
    margin: 3px 0;
    font-size: 1rem;
    color: #333;
  }
  p {
    margin: 0;
    font-size: 0.7rem;
    line-height: 1rem;
    color: #555;
  }
`;
const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  time {
    font-size: 12px;
    color: #aaa;
    font-family: inherit;
  }
`;

export default function ProductReviews({ product }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  async function submitReview() {
    await axios
      .post("/api/reviews", {
        title,
        description,
        stars,
        product: product._id,
      })
      .then((response) => {
        setTitle("");
        setDescription("");
        setStars(0);
        setReviews(response.data);
        loadReviews();
      });
  }

  useEffect(() => {
    loadReviews();
  }, []);

  function loadReviews() {
    setReviewsLoading(true);
    axios.get("/api/reviews?product=" + product._id).then((response) => {
      setReviews(response.data);
      setReviewsLoading(false);
    });
  }

  return (
    <div>
      <Title>商品評價</Title>
      <ColsWrapper>
        <div>
          <WhiteBox>
            <Subtitle>新增評價</Subtitle>
            <div>
              <StarsRating onChange={setStars} />
            </div>
            <Input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              placeholder="請輸入標題"
            ></Input>
            <Textarea
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              placeholder="分享您的購物體驗並幫助大家作出更好的選擇！"
            />
            <div>
              <Button
                onClick={() => {
                  submitReview(title, description, stars, product);
                }}
                primary
              >
                提交您的評論
              </Button>
            </div>
          </WhiteBox>
        </div>
        <div>
          <WhiteBox>
            <Subtitle>所有評價</Subtitle>
            {reviewsLoading && <Spinner fullWidth={true} />}
            {!reviewsLoading && reviews.length === 0 && (
              <p>此商品目前沒有任何評價 :(</p>
            )}
            {!reviewsLoading &&
              reviews.length > 0 &&
              reviews.map((review) => (
                <ReviewWrapper key={review._id}>
                  <ReviewHeader>
                    <div>
                      <StarsRating
                        size={"sm"}
                        disabled={true}
                        defaultHowMany={review.stars}
                      />
                    </div>
                    <div>
                      <time>
                        {new Date(review.createdAt).toLocaleString("zh-TW")}
                      </time>
                    </div>
                  </ReviewHeader>
                  <h3>{review.title}</h3>
                  <p>{review.description}</p>
                </ReviewWrapper>
              ))}
          </WhiteBox>
        </div>
      </ColsWrapper>
    </div>
  );
}
