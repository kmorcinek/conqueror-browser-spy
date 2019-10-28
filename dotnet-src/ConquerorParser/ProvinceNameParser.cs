using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace ConquerorParser
{
    public class ProvinceNameParser
    {
        public static void Run()
        {
            string content = File.ReadAllText(@"../../../../../../conqueror maps svg.txt");

            var regex = new Regex(@"<text id=""info_(\D+?)""");

            MatchCollection matchCollection = regex.Matches(content);

            var provinces = matchCollection.Select(match => match.Groups[1].Value).ToArray();

            var @join = string.Join("\", \"", provinces);
        }
    }
}