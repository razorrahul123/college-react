import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import college from "./colleges.json";
import image from "./college_02.jpg";

const CollegeCard = ({ college }) => (
  <div className="card-container">
    <div className="img">
      {college.promoted ? (
        <div className="promoted-container">
          <span>PROMOTED</span>
        </div>
      ) : null}
      <div className="tags-container">
        {college.tags.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="rating-container">
        <span>{college.rating} / 5</span>
        <span>{college.rating_remarks}</span>
      </div>
      <div className="ranking-container">
        <span># {college.ranking}</span>
      </div>
      <div className="img-container">
        <img alt="college" src={image} />
      </div>
    </div>
    <div className="info-container">
      <div className="info-left-wrapper">
        <div className="info-left">
          <p className="title">{college.college_name}</p>
          <div className="near-container">
            {college.nearest_place.map((item) => (
              <span key={item}>{item} &nbsp;</span>
            ))}
          </div>
          <div>
            <span className="match-container">
              93% Match : {college.famous_nearest_places}
            </span>
          </div>
        </div>
        <div className="offer-container">{college.offertext}</div>
      </div>
      <div className="info-right">
        <div className="discount-container">
          <span className="original-fees-container">
            &#8377; {college.original_fees}
          </span>
          <span className="percent-containter">20</span>
        </div>
        <span className="discount-fees-container">
          {" "}
          &#8377; {college.discounted_fees}
        </span>
        <span className="fee-cycle-container">{college.fees_cycle}</span>
        <ul className="amenities-container">
          {college.amenties.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

function App() {
  const [currentList, setCurrentList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [currentLength, setCurrentLength] = useState(0);

  useEffect(() => {
    if (college.colleges && college.colleges.length > 0) {
      if (college.colleges.length < 10) {
        setCurrentList(college.colleges);
        setCurrentLength(college.colleges.length);
        setHasMore(false);
      } else {
        setCurrentList(college.colleges.slice(0, 10));
        setHasMore(true);
      }
    }
  }, []);

  useEffect(() => {
    if (currentLength > 0) {
      setCurrentList((prev) => {
        return [
          ...prev,
          ...college.colleges.slice(currentLength, currentLength + 10),
        ];
      });
      if (currentLength >= college.colleges.length) {
        setHasMore(false);
      }
    }
  }, [currentLength]);

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentLength((prev) => prev + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  return (
    <div className="App">
      <div className="root-div">
        <section>Colleges in North India</section>
        <div id="infinite-scroll-list" className="infinite-scroll-list">
          {currentList
            ? currentList.map((college, index) => {
                if (currentList.length === index + 1) {
                  return (
                    <div ref={lastElementRef} key={college.college_name}>
                      <CollegeCard
                        key={college.college_name}
                        college={college}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={college.college_name}>
                      <CollegeCard
                        key={college.college_name}
                        college={college}
                      />
                    </div>
                  );
                }
              })
            : null}
        </div>
      </div>
    </div>
  );
}

export default App;
