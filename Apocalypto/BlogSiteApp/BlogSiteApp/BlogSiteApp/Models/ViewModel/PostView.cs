using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BlogSiteApp.Models.ViewModel
{
    public class PostView
    {
        public int PostId { set; get; }
        public string PostTitle { set; get; }
        public string PostDescription { set; get; }
        public string PostDate { set; get; }
        public string AuthorName { set; get; }
        public string AuthorId { set; get; }
    }
}