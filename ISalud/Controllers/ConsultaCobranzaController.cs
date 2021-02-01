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
    public class ConsultaCobranzaController : Controller
    {
        // GET: ConsultaCobranza
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public JsonResult CargarGrilla(DtoConsultaCobranza data)
        {
            Respuesta Respuesta = new Respuesta();
            try
            {
                MConsultaCobranza Model = new MConsultaCobranza();
                Respuesta = Model.CargarGrilla(data);
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