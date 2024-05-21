import "./Loading.css";
import { db } from "../../../firebase-config";

const Loading = () => {

  return (
 
	<div className="card">
		<div className="card-img skeleton">
		</div>
		<div className="card-body">
			<h2 className="card-title skeleton">
			</h2>
			<p className="card-intro skeleton">
			</p>
		</div>
	
</div>
  );
};

export default Loading;
