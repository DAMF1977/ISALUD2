using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using BL.Modelos;
using EL.Entradas;
using EL.Salidas;


namespace ISalud.Controllers
{
    public class CalcularMontosController : Controller
    {
        // GET: CalcularMontos
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public JsonResult ConsultaBonosParaCobro(DtoCobroBono data)
        {
            Respuesta Respuesta = new Respuesta();
            try
            {
                MCobroFactura Model = new MCobroFactura();
                Respuesta = Model.ConsultaBonosParaCobro(data);
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Response.StatusDescription = ex.Message.Replace("\r", "").Replace("\n", "").Replace("\t", "").Replace("\v", "").Replace("\f", "").ToString();
            }

            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet, MaxJsonLength = 500000000, Data = Respuesta };
        }




    }




}