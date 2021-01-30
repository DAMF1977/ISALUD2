using EL.Entradas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Modelos
{
    public class MSession
    {
        /// <summary>
		/// Método que realiza el registro la session del usuario
		/// </summary>
        public static void RegisterSession(DtoSessionUsuario sess)
        {
            System.Web.HttpContext.Current.Session["UsuarioSess"] = sess;
        }

        /// <summary>
		/// Método que checkea los recursos del objeto de sesion del usuario
		/// </summary>
        public static bool CheckSession()
        {
            if (System.Web.HttpContext.Current.Session["UsuarioSess"] != null)
                return true;
            else
                return false;
        }

        /// <summary>
		/// Método que devuelve el objeto de sesion del usuario
		/// </summary>
        public static object ReturnSessionObject()
        {
            if (CheckSession())
                return System.Web.HttpContext.Current.Session["UsuarioSess"];
            else
                return null;
        }
    }
}
