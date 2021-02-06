using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
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

        [ActionName("CobrarFacturaArchivo")]
        public ActionResult Index6()
        {
            return View();
        }

        [ActionName("CobrarFacturaCuentaMedica")]
        public ActionResult Index7()
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

        [HttpPost]
        public JsonResult SubirArchivo()
        {
            Respuesta respuesta = new Respuesta();
            try
            {
                if (Request.Files.Count > 0)
                {
                    HttpFileCollectionBase files = Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFileBase file = files[i];
                        string fname;
                        if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                        {
                            string[] testfiles = file.FileName.Split(new char[] { '\\' });
                            fname = testfiles[testfiles.Length - 1];
                        }
                        else
                            fname = file.FileName;

                        string fileName = Path.GetFileName(fname);
                        string formato = Path.GetExtension(fname);
                        string filePath = "";

                        string folder = ConfigurationManager.AppSettings["RutaArchivos"];
                        if (folder.Contains("~")) folder = Server.MapPath(folder);

                        filePath = Path.Combine(folder, fileName);
                        file.SaveAs(filePath);

                        var values = Request.Form;
                        var rut_prestador = (!string.IsNullOrEmpty(values["RutPrestador"])) ? Convert.ToInt64(values["RutPrestador"]) : 0;

                        MCobroFactura Model = new MCobroFactura();
                        DtoCobroBonoAdicional parametros = new DtoCobroBonoAdicional() { 
                            RutPrestador = rut_prestador,
                            NumerosBono = Model.ObtieneBonosExcel(filePath)
                        };
                        respuesta = Model.ConsultaBonosParaCobroAdicional(parametros);
                    }
                }

                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Response.StatusDescription = ex.Message.Replace("\r", "").Replace("\n", "").Replace("\t", "").Replace("\v", "").Replace("\f", "").ToString();
            }

            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet, Data = respuesta };
        }

        [HttpPost]
        public JsonResult CobrarFacturaBonosCuentaMedica(DtoCobroFacturaCtaMedica data)
        {
            Respuesta Respuesta = new Respuesta();
            try
            {
                MCobroFactura Model = new MCobroFactura();
                Respuesta = Model.CobrarFacturaBonosCuentaMedica(data);
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
        public JsonResult EnviarDocumentoCuentaMedica(List<DtoCuentaMedicaDocumento> data)
        {
            Respuesta Respuesta = new Respuesta();
            try
            {
                MCobroFactura Model = new MCobroFactura();
                Respuesta = Model.GeneraEnvioDocumentosCuentaMedica(data);
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
        public JsonResult ObtieneFacturaPDF(DtoFacturaPDF data)
        {
            Respuesta Respuesta = new Respuesta();
            try
            {
                MCobroFactura Model = new MCobroFactura();
                Respuesta = Model.ObtieneFacturaPDF(data);
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