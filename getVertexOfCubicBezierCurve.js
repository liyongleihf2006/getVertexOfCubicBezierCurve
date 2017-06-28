/**
 * Created by Administrator on 2017/6/28.
 * 获取三次贝塞尔曲线的顶点
 * 所谓顶点是指距离曲线两个端点连线最远的点
 * 当控制点分属两个端点连线两侧的时候顶点有两个
 * 当控制点都在端点的同一侧的时候顶点只有一个
 * @param  points 贝塞尔曲线点
 *                 格式为[x0,y0,x1,y1,x2,y2,x,y]或者 x0,y0,x1,y1,x2,y2,x,y ;其中{x0,y0}和{x,y}为坐标点,{x1,y1}和{x2,y2}为控制点
 * @return {Array} trianglePoints 顶点的数组:
 */
function getTrangleOfBezierCurve(points){
    if(!points){
        throw new Error("The Bezier curve points is undefined");
    }
    if(!(points instanceof Array)){
        points=[].slice.call(arguments);
    }
    if(points.length!=8){
        throw new Error("The number of Bezier curve points must be 4, so the incoming coordinates must be 8");
    }
    points.forEach(function(point){
        if(isNaN(+point)){
            throw new Error("The Bezier curve points must be numeric values");
        }
    });
    /*
     * 我认为三次贝塞尔曲线的顶点(距离坐标点连线最远的点)应该是贝塞尔曲线上面切线与坐标点连线平行的点.
     * 三次贝塞尔曲线的坐标方程式为(假定自变量为t,t∈[0,1]):
     *     x'=x0*(1-t)*(1-t)*(1-t)+3*x1*(1-t)*(1-t)*t+3*x2*(1-t)*t*t+x*t*t*t
     *     y'=y0*(1-t)*(1-t)*(1-t)+3*y1*(1-t)*(1-t)*t+3*y2*(1-t)*t*t+y*t*t*t
     * 上面的x'与y'分别求导取切线可得:
     *    dx=-3*x0*(1-t)*(1-t)-6*x1*(1-t)*t+3*x1*(1-t)*(1-t)-3*x2*t*t+6*x2*(1-t)*t+3*x*t*t
     *    dy=-3*y0*(1-t)*(1-t)-6*y1*(1-t)*t+3*y1*(1-t)*(1-t)-3*y2*t*t+6*y2*(1-t)*t+3*y*t*t
     * 计算可得:
     *    dx=(-3*x0+9*x1-9*x2+3*x)*t*t+(6*x0-12*x1+6*x2)*t+(-3*x0+3*x1)
     *    dy=(-3*y0+9*y1-9*y2+3*y)*t*t+(6*y0-12*y1+6*y2)*t+(-3*y0+3*y1)
     * 现在需要切线与{x0,y0},{x,y}的连线平行:
     *    dy/dx=(y-y0)/(x-x0)
     * 上面这个方程是一元二次方程,而一元二次方程的根公式为:
     *    x1=(-b+Math.sqrt(b*b-4*a*c))/(2*a)
     *    x2=(-b-Math.sqrt(b*b-4*a*c))/(2*a)
     * 其中 a=(y0-y)*(-x0+3*x1-3*x2+x)-(x0-x)*(-y0+3*y1-3*y2+y)
     *      b=(y0-y)*(2*x0-4*x1+2*x2)-(x0-x)*(2*y0-4*y1+2*y2)
     *      c=(y0-y)*(-x0+x1)-(x0-x)*(-y0+y1)
     * */
    var x0=+points[0],y0=+points[1],x1=+points[2],y1=+points[3],x2=+points[4],y2=+points[5],x=+points[6],y=+points[7];
    var a = (y0 - y) * (-x0 + 3 * x1 - 3 * x2 + x) - (x0 - x) * (-y0 + 3 * y1 - 3 * y2 + y),
        b = (y0 - y) * (2 * x0 - 4 * x1 + 2 * x2) - (x0 - x) * (2 * y0 - 4 * y1 + 2 * y2),
        c = (y0 - y) * (-x0 + x1) - (x0 - x) * (-y0 + y1);
    var result=[];
    /*
     * 当x0==x1,x2==x,y0==y1,y2==y的时候点是一条直线,这时候顶点我们认为是在两个坐标点连线的中心
     * */
    if(x0==x1&&x2==x&&y0==y1&&y2==y){
        result.push([(x0+x)/2,(y0+y)/2]);
        return result;
    }
    var t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a),
        t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    _getTrianglePoints(t1);
    _getTrianglePoints(t2);
    return result;
    function _getTrianglePoints(t){
        if(t<0||t>1){
            return;
        }
        result.push([x0 * (1 - t) * (1 - t) * (1 - t) + 3 * x1 * (1 - t) * (1 - t) * t + 3 * x2 * (1 - t) * t * t + x * t * t * t,
            y0 * (1 - t) * (1 - t) * (1 - t) + 3 * y1 * (1 - t) * (1 - t) * t + 3 * y2 * (1 - t) * t * t + y * t * t * t]);
    }
}
