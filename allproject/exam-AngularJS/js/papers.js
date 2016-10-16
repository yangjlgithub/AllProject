/**
 * Created by Administrator on 2016/9/29.
 * 试卷模板
 */
angular.module("app.papers",["ng","app.subject"])
    //试卷添加控制器
    .controller("paperAddsController",["$scope","CommonService","$routeParams","paperModel","paperService",function ($scope,CommonService,$routeParams,paperModel,paperService) {
        CommonService.getAllDepartmentes(function (data) {
            $scope.departmentes=data;
        });
        var subjectId = $routeParams.id;
        if(subjectId!=0){
            //将要添加的题目的id添加到数组中
            paperModel.addSubjectId(subjectId);
            paperModel.addSubjects(angular.copy($routeParams));
        }
        //alert(subjectId);
        //双向绑定模板
        $scope.papermodel=paperModel.model;
        //保存
        $scope.paperSave=function () {
            paperService.savePaper($scope.papermodel,function (data) {
                alert(data);
            })
        }
    }])
    .factory("paperService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
        return{
            savePaper:function (params,handler) {
                var obj = {};
                //处理数据
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
                        case "answerQuestionTime":obj['answerQuestionTime']=val;
                            break;
                        case "totalPoints":obj['paper.totalPoints']=val;
                            break;
                        case "scores":obj['scores']=val;
                            break;
                        case "subjectIds":obj['subjectIds']=val;
                            break;
                    }
                }
                //对obj对象进行表单格式的序列化操作
                obj=$httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                    handler(data);
                })
            }
        }
    }])
    .factory("paperModel",function () {
        return{
            model:{
                departmentId:1,             //方向
                papertitle:"",              //试卷标题
                description:"",             //试卷描述
                answerQuestionTime:0,       //答题时间
                totalPoints:0,              //总分
                scores:[],                  //每个题目的分值
                subjectIds:[],              //每个题目的Id
                subjects:[]                 //每个题目的信息
            },
            addSubjectId:function (id) {
                this.model.subjectIds.push(id)
            },
            addSubjects:function (subject) {
                this.model.subjects.push(subject)
            }
        }
    })