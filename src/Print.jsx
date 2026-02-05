import {useState,useEffect} from 'react';
import { renderToString } from 'react-dom/server';
import axios from "axios";
import './Print.css';

export default function PrintComponent(){

    const [labelElement, setLabelElement] = useState(null);
    const [showControls, setShowControls] = useState(false);
    const [baseUrl, setBaseUrl] = useState(null);

    const server = {
        "dld":"https://dld.com.br/logistica/index.php?",
        "head":"https://headbrasil.com.br/feed/logistica"
    };

    var timeoutId;

    useEffect(() => {
        setLabelElement(<LabelData consulta="initial" cliente="waiting" />);

        // Add the event listener when the component mounts
        window.addEventListener('afterprint', handleAfterPrint);

        // Remove the event listener when the component unmounts
        return () => {
        window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, []);

    const handleAfterPrint = () => {
        console.log('Print dialog closed, or printing started/finished.');
        window.location.reload(true);
    };

    function handleUrl(url){
        // Clear the previous timer
        clearTimeout(timeoutId);
        // Set a new timer
        timeoutId = setTimeout(() => {
            console.log("Input change finished. Executing function...");
            // Call your function here
            callApi(url);
        }, 500);
    }

    function callApi(url){

        const urlParams = new URLSearchParams(url);
       
        var url = server[urlParams.get('plataforma').toLowerCase()] + '/handleConsult' + url;

       // setBaseUrl(server[urlParams.get('plataforma').toLowerCase()]);
       setLabelElement(<Preloader />);

        axios
                .get(url)
                .then(function (response) {
                    if(response.status == 200){
                        response = response.data;
                        let name = `${response.firstname} ${response.lastname}`;
                        setLabelElement(<LabelData consulta={response.consult_id} cliente={name} />);
                        setShowControls(true);
                    }
                    
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
    }

    function boxApi(){

        const sufixUrl = document.getElementById('print-element-id').value;

        var quantity = document.getElementById('print-quantity').value;

        const urlParams = new URLSearchParams(sufixUrl);

        var url = server[urlParams.get('plataforma').toLowerCase()] + '/handleOrderBoxes' + sufixUrl;
            url += `&quantity=${quantity}`;

         axios
                .get(url)
                .then(function (response) {
                    if(response.status == 200){
                        // response = response.data;
                       //  let name = `${response.firstname} ${response.lastname}`;
                      //   setLabelElement(<LabelData consulta={response.consult_id} cliente={name} />);
                    }
                    
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
    }


    const LabelData = (props) => {

        const consulta = props.consulta;
        const cliente = props.cliente;

       return  labelElement == null ? 
            (<div><h1>Aguardando leitura ...</h1></div>): 
            (
                <table className='table table-bordered'>
                    <tbody>
                        <tr><td>Consulta:</td><td>{consulta}</td></tr>
                        <tr><td>Cliente:</td><td>{cliente}</td></tr>
                    </tbody>
                </table>
             )

    }


    const Preloader  = () => (

        <img src='src/assets/img/808.gif' className='preloader' alt='Carregando...' />

    )


    function printElementById(elementId) {

        boxApi();

        var quantity = document.getElementById('print-quantity').value;
        
        var labelContent = '<div id="print-area">';

        for(var i = 0; i < quantity; i++){

            labelContent+= renderToString(labelElement);
        }

        labelContent+=`</div>`;

        var originalContent = document.body.innerHTML; // Save original page content

        document.body.innerHTML = labelContent; // Replace body with print content
        
        window.print(); // Open the print dialog

        document.body.innerHTML = originalContent; // Restore original content after the dialog is closed or cancelled
        
        console.log("Printing element with ID:", elementId);
    }



    return (
        <>
            <header className="header-area animated menu-fixed fadeInDown">
                <div className="container">
                    <div className="header__main">
                        <a href="index.html" className="logo">
                            <img src="https://dld.com.br/images/logo-dld.png" alt="logo"/>
                        </a>
                    </div>
                    <span>Gerador de etiquetas de impressão para conferência logística</span>
                </div>
            </header>

            <div className='body-container'>
                <input type='text' name='print-element-id' id='print-element-id'  autoFocus  onChange={(e) => handleUrl(e.target.value)}/>
                <div id="temp-area">
                    {labelElement}
                </div>

                {showControls &&
                <div className='quantity-select'>
                    <label htmlFor="print-quantity">Quantidade:</label>
                    <select className="form-select" aria-label="Default select example" id='print-quantity'>
                            <option defaultValue={1}  value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                    </select>
                    <button onClick={() => printElementById('print-area')} className='btn btn-secondary print-btn'><i className="fa-solid fa-print"></i> Imprimir</button>
                </div>}
            </div>
        </>
    );
}