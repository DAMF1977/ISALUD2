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
    public class CobrarFacturaController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("CobrarFacturaIndex")]
        public ActionResult Index2()
        {
            return View();
        }

        [ActionName("CobrarFacturaBono")]
        public ActionResult Index3()
        {
            return View();
        }

        [ActionName("ExitoCobro")]
        public ActionResult Index4()
        {
            return View();
        }

        [ActionName("ErrorCobro")]
        public ActionResult Index5()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ConsultaFacturasPorCobrar(DtoCobroFactura data)
        {
            Respuesta Respuesta = new Respuesta();
            try
            {
                MCobroFactura Model = new MCobroFactura();
                Respuesta = Model.ConsultaFacturas(data);
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Response.StatusDescription = ex.Message.Replace("\r", "").Replace("\n", "").Replace("\t", "").Replace("\v", "").Replace("\f", "").ToString();
            }

            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet, Data = Respuesta };
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

        [HttpPost]
        public JsonResult CobrarFacturaBonos(DtoCobrarFacturaBonos data)
        {
            Respuesta Respuesta = new Respuesta();
            try
            {
                MCobroFactura Model = new MCobroFactura();
                Respuesta = Model.CobrarFacturaBonos(data);
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Response.StatusDescription = ex.Message.Replace("\r", "").Replace("\n", "").Replace("\t", "").Replace("\v", "").Replace("\f", "").ToString();
            }

            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet, Data = Respuesta };
        }
    }
}