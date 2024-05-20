import "./Loading.css";
import { db } from "../../../firebase-config";

const Loading = () => {

  return (
 
	<div class="card">
		<div class="card-img skeleton">
		</div>
		<div class="card-body">
			<h2 class="card-title skeleton">
			</h2>
			<p class="card-intro skeleton">
			</p>
		</div>
	
</div>
  );
};

export default Loading;
