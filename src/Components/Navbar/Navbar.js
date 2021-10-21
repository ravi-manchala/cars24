import React from "react";

import Classes from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={Classes.nav}>
      <div>
        <img
          className={Classes.logo}
          src="https://consumer-web-ae.qac24svc.dev/ae/static/js/42a884476ab8ee4a3642ef07389f1a63.svg"
          alt="CARS24"
        ></img>
      </div>
      <div className={Classes.listItems}>
        <ul>
          <li>
            <img
              src="https://consumer-web-ae.qac24svc.dev/ae/static/js/30f825347a79ab9fa31e6c910e1f65ff.svg"
              alt="Call"
            />
          </li>
          <li>
            <img
              src="https://consumer-web-ae.qac24svc.dev/ae/static/js/8dfd970d41879cc53c843f30407d88b8.svg"
              alt="Wishlist"
            ></img>
          </li>
          <li>
            <img
              src="https://consumer-web-ae.qac24svc.dev/ae/static/js/ce8c126471ada82fd3f0245de6e68646.svg"
              alt="Menu"
            ></img>
          </li>
        </ul>
      </div>
    </nav>

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // <nav className={Classes.nav}>
    //   <div>
    //     <img
    //       src="https://consumer-web-ae.qac24svc.dev/ae/static/js/42a884476ab8ee4a3642ef07389f1a63.svg"
    //       alt="CARS24"
    //     />
    //   </div>
    //   <div>
    //     <ul>
    //       <li>
    //         <img
    //           src="https://consumer-web-ae.qac24svc.dev/ae/static/js/30f825347a79ab9fa31e6c910e1f65ff.svg"
    //           alt="Call"
    //         />
    //       </li>
    //       <li>
    //         <img
    //           src="https://consumer-web-ae.qac24svc.dev/ae/static/js/8dfd970d41879cc53c843f30407d88b8.svg"
    //           alt="Wishlist"
    //         ></img>
    //       </li>
    //       <li>
    //         <img
    //           src="https://consumer-web-ae.qac24svc.dev/ae/static/js/ce8c126471ada82fd3f0245de6e68646.svg"
    //           alt="Menu"
    //         ></img>
    //       </li>
    //     </ul>
    //   </div>
    // </nav>
  );
};

export default Navbar;
