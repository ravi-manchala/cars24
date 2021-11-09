import React, { useState } from "react";
import classes from "./Filters.module.css";

const Filters = (props) => {
  const { filters, filter_modal_Close } = props;
  // console.log(filters);
  const [optionName, setOptionName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [suggestionData, setSuggestionsData] = useState();
  const [bucketData, setBucketData] = useState();
  const [selectedFilters, setSelectedFilters] = useState({});

  const optionsData = (index) => {
    setOptionName(filters[index].name);
    setFilterType(filters[index].filterType);
    setSuggestionsData(filters[index].suggestions);
    setBucketData(filters[index].buckets);
  };

  // console.log(filters);
  // console.log(filterType);
  // console.log(optionName);
  // console.log(filterType);
  // console.log(suggestionData);
  // console.log(bucketData);

  const suggestionUrlData = (index, filterType) => {
    const newData = {
      ...selectedFilters,
      [optionName]: {
        filterType: filterType,
        name: optionName,
        min: suggestionData[index].min,
        max: suggestionData[index].max,
      },
    };
    setSelectedFilters(newData);
    props.suggestionsUrlHandler(newData);
  };
  // console.log(selectedFilters);

  const checkboxUrldata = (brandname) => {
    // console.log(brandname);
    if (brandname.subFacet) {
      props.getCount({
        name: optionName,
        values: [
          {
            name: brandname.name,
            models: brandname.subFacet.buckets.map((val) => val.name),
          },
        ],
      });
    } else {
      props.getCount({
        name: optionName,
        model: brandname.name,
      });
    }
  };

  return (
    <div className={classes.filter_modal_ui}>
      <div className={classes.heading}>
        <img
          onClick={filter_modal_Close}
          src="https://consumer-web-ae.qac24svc.dev/ae/static/js/8e795214a56ae869b2f276365fe7eca0.svg"
          alt="close"
        ></img>
        <p>Filters</p>
      </div>
      <div className={classes.optionsForm}>
        <div className={classes.options}>
          {filters.map((option, index) => {
            return (
              <div key={option.name} className={classes.optionBtn}>
                <p onClick={() => optionsData(index)}>{option.displayName}</p>
              </div>
            );
          })}
        </div>
        <div className={classes.suggestions_bucketData}>
          <div>
            {suggestionData &&
              filterType === "rf" &&
              suggestionData.map((suggestion, index) => {
                return (
                  <div key={suggestion.name}>
                    <input
                      type="radio"
                      name="suggestion"
                      id={suggestion.name}
                      value={suggestion.name}
                      onChange={() => suggestionUrlData(index, filterType)}
                    />
                    <label htmlFor={suggestion.name}>{suggestion.name}</label>
                  </div>
                );
              })}
          </div>
          <div>
            {suggestionData &&
              filterType === "sf" &&
              suggestionData.map((suggestion) => {
                return (
                  <div key={suggestion.name}>
                    {suggestion.subFacet.buckets.map((model) => {
                      return (
                        <div key={model.name}>
                          <input
                            type="checkbox"
                            name={model.name}
                            id={model.name}
                            value={model.name}
                          />
                          <label htmlFor={model.name}>
                            {suggestion.name} {model.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>

          <div>
            {bucketData &&
              bucketData.map((brandName) => {
                return (
                  <div
                    className={classes.brand_modal_name}
                    key={brandName.name}
                  >
                    <div className={classes.car_brand_name}>
                      <input
                        type="checkbox"
                        id={brandName.name}
                        name={brandName.name}
                        value={brandName.name}
                        onChange={() => checkboxUrldata(brandName)}
                      />
                      <label htmlFor={brandName.name}>{brandName.name}</label>
                    </div>
                    <div>
                      {brandName.subFacet &&
                        brandName.subFacet.buckets.map((model) => {
                          return (
                            <div
                              key={model.name}
                              className={classes.car_modal_name}
                            >
                              <input
                                type="checkbox"
                                id={model.name}
                                name={model.name}
                                value={model.name}
                                // checked={
                                //   props.selectedFilters &&
                                //   props.selectedFilters[ele.name] &&
                                //   props.selectedFilters[ele.name]
                                // }
                              />
                              <label htmlFor={model.name}>{model.name}</label>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className={classes.btns}>
        <div>
          <button className={classes.clearbtn}>
            <span>CLEAR ALL</span>
          </button>
        </div>
        <div>
          <button className={classes.showcarsbtn}>
            <span>SHOW 0 CARS</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;

// ******************************************************************************************************************************************************************************************* //

// const Filters = (props) => {
//   const { filters, filter_modal_Close } = props;
//   const [bucketData, setBucketData] = useState();
//   const [suggestions, setSuggestions] = useState();
// const [selectedFacet, setSelectedFacet] = useState("");

//   // selected car count state
//   // const [count, setCount] = useState(initialCount);

//   const getBuckets = (name, index) => {
//     setSelectedFacet(name);
//     setBucketData(filters[index].buckets);
//     setSuggestions(filters[index].suggestions);
//   };

//   // console.log(filters);
//   // console.log(suggestions);
//   console.log(bucketData);

//   const selectedCarCount = (option, eve) => {
//     const { name, checked } = eve.target;
//     console.log(name, checked);
//     props.getCount({
//       name: selectedFacet,
//       values: [
//         {
//           name: option.name,
//           models: option.subFacet.buckets.map((val) => val.name),
//         },
//       ],
//     });
//   };

//   return (
//     <div>
//       <div className={classes.heading}>
//         <img
//           onClick={filter_modal_Close}
//           src="https://consumer-web-ae.qac24svc.dev/ae/static/js/8e795214a56ae869b2f276365fe7eca0.svg"
//           alt="close"
//         ></img>
//         <p>Filters</p>
//       </div>
//       <div className={classes.optionsForm}>
//         <div className={classes.options}>
//           {filters.map((option, index) => {
//             return (
//               <div key={option.name} className={classes.optionBtn}>
//                 <p onClick={() => getBuckets(option.name, index)}>
//                   {option.displayName}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//         <div className={classes.suggestions_bucketData}>
//           <div>
//             {suggestions &&
//               suggestions.map((suggestion) => {
//                 return (
//                   <div key={suggestion.name}>
//                     {suggestion.subFacet &&
//                       suggestion.subFacet.buckets.map((model) => {
//                         return (
//                           <div key={model.name}>
//                             <input
//                               type="checkbox"
//                               name={model.name}
//                               id={model.name}
//                             />
//                             <label htmlFor={model.name}>
//                               {" "}
//                               {suggestion.name}
//                               {model.name}
//                             </label>
//                           </div>
//                         );
//                       })}
//                     <div>
//                       <label htmlFor={suggestion.name} />
//                       <input
//                         type="checkbox"
//                         name={suggestion.name}
//                         id={suggestion.name}
//                       />
//                       <span>{suggestion.name}</span>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>
//           <div>
//             {/* <h4 className={classes.all_brand_heading}>All Brands</h4> */}
//             {bucketData &&
//               bucketData.map((ele, index) => {
//                 return (
//                   <div className={classes.brand_modal_name} key={ele.name}>
//                     <div className={classes.car_brand_name}>
//                       <input
//                         type="checkbox"
//                         name={ele.name}
//                         id={ele.name}
//                         onClick={(eve) => selectedCarCount(ele, eve)}
//                       />
//                       <label htmlFor={ele.name}> {ele.name}</label>
//                     </div>
//                     <div>
//                       {ele.subFacet &&
//                         ele.subFacet.buckets.map((subele) => {
//                           return (
//                             <div
//                               key={subele.name}
//                               className={classes.car_modal_name}
//                             >
//                               <input
//                                 type="checkbox"
//                                 id={subele.name}
//                                 name={subele.name}
//                                 // checked={
//                                 //   props.selectedFilters &&
//                                 //   props.selectedFilters[ele.name] &&
//                                 //   props.selectedFilters[ele.name]
//                                 // }
//                               />
//                               <label htmlFor={subele.name}>{subele.name}</label>
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>
//       </div>
//  <div className={classes.btns}>
//    <div>
//      <button className={classes.clearbtn}>
//        <span>CLEAR ALL</span>
//      </button>
//    </div>
//    <div>
//      <button className={classes.showcarsbtn}>
//        <span>SHOW 0 CARS</span>
//      </button>
//    </div>
//  </div>
//  </div>
//   );
// };

// export default Filters;
