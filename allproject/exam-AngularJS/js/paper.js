/**
 * Created by Administrator on 2016/9/28.
 * 试卷模块
 */
angular.module("app.paper",["ng","app.subject"])
    //试卷查询控制器
    .controller("paperListController",["$scope",function ($scope) {

    }])
    //试卷添加控制器
    .controller("paperAddController",["$scope","CommonService","$routeParams","paperModel","paperService",function ($scope,CommonService,$routeParams,paperModel,paperService) {
        CommonService.getAllDepartmentes(function (data) {
            //将全部方向绑定到departmentes
            $scope.departmentes=data;
        });
        var subjectId = $routeParams.id;
        //console.log($routeParams);
        if(subjectId!=0){
            //将要添加的题目的id添加到数组中
            paperModel.addSubjectId(subjectId);
            paperModel.addSubject(angular.copy($routeParams));
        }
        //双向绑定的模板
        $scope.papermodel=paperModel.model;
        //console.log($scope.papermodel.subjects);
        //保存功能
        $scope.paperSave=function () {
            paperService.savePaper($scope.papermodel,function (data) {
                console.log($scope.papermodel);
                alert(data);
            })
        }
    }])
    //试卷删除控制器
    .controller("paperDelController",["$scope",function ($scope) {

    }])
    .factory("paperService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
        return{
            savePaper:function (params,handler) {
                var obj={};
                //处理数据
                //console.log(params);
                for(var key in params){
                    var val = params[key];
                    //console.log(key,val);
                    switch (key){
                        case "departmentId":obj['paper.department.id']=val;
                            break;
                        case "papertitle":obj['paper.title']=val;
                            break;
                        case "description":obj['paper.description']=val;
                            break;
                        case "answerQuestionTime":obj['paper.answerQuestionTime']=val;
                            break;
                        case "totalPoints":obj['paper.totalPoints']=val;
                            break;
                        case "scores":obj['scores']=val;
                            break;
                        case "subjectIds":obj['subjectIds']=val;
                            break;
                    }
                }
                //对obj对象进行表单格式的序列化操作（默认使用JSON格式）
                obj=$httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                    handler(data);
                });
            }
        }
    }])
    .factory("paperModel",function () {
        return{
            //单例模板
            model:{
                departmentId:1,             //方向
                papertitle:"",              //试卷标题
                description:"",             //试卷描述
                answerQuestionTime:0,       //答题时间
                totalPoints:0,              //总分
                scores:[],                  //每个题目的分值
                subjectIds:[] ,              //每个题目的Id
                subjects:[]
            },
            addSubjectId:function (id) {
                this.model.subjectIds.push(id);
            },
            addSubject:function (subject) {
                this.model.subjects.push(subject);
            }
        }
    });