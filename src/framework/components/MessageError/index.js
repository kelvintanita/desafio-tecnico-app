import React from 'react';
import { Alert } from 'antd';

function MessageError({ error }) {

	if (!error) return <div />;
 
	return (
		<div>


			<Alert type="error" message={Object.keys(error).map((item) => <div> {error[item].map((err) => <p>{err}</p>) }</div>)}  />
		</div>
	);
}


export default MessageError;


// import React from 'react';
// import { Alert } from 'antd';




// function MessageError({ error }) {

//     if (!error) return <div />;


//     console.log('error', error);
//     var validacoes = {
//         Titulo: [
//            "teste"
//         ]
//      }
//     return (
         
//          Object.keys(validacoes).map((item) => <div> {item.map((err) => <p>{err}</p>) } </div>)

//         // <div>
//         //     {Object.keys(error).map((item) => <div> {item.map((err) => <p>{err}</p>) }</div>)}
//         //     {/* <Alert type="error" message={} /> */}

//         // </div>
//     );
// }


// export default MessageError;