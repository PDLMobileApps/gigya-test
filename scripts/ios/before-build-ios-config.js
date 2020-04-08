var path = require('path');
var xcode = require('xcode');
var fs = require('fs');
var projName = 'GigyaTest'
var projectPath = path.join('platforms/ios', projName + '.xcodeproj', 'project.pbxproj');
var appProject = xcode.project(projectPath);

var removeBuildPhase = function (appProj, buildPhaseName) {
    var targets, target, buildPhaseId = null;

    targets = appProj.hash.project.objects['PBXNativeTarget'];
    //console.log('targets:', targets);
    for (var key in targets) {
        // only look for comments
        if (/_comment$/.test(key)) continue;

        target = targets[key].buildPhases;
        //console.log('target: ', target);
        for (var element in target) {
            if (target[element].comment === buildPhaseName) {
                buildPhaseId = target[element].value;
                //console.log('buildPhaseId: ', buildPhaseId);
                target.splice(element, 1);
                break;
            }
        }
        //console.log('target: ', target);
    }
    //console.log('targets:', targets);

    if (buildPhaseId) {
        targets = appProj.hash.project.objects['PBXShellScriptBuildPhase'];
        //console.log('targets:', targets);
        delete targets[buildPhaseId];
        delete targets[buildPhaseId + '_comment'];
        //console.log('targets:', targets);
    }
}

var addBuildPhase = function (appProj, phaseName, phaseType, options) {
    // remove the Run Script phase first to avoid duplication
    removeBuildPhase(appProj, phaseName);
    appProj.addBuildPhase([], phaseType, phaseName, appProj.getFirstTarget().uuid, options);
}

var embedFramework = function (appProj, frameworkPluginName, frameworkName) {
    //first remove so they aren't duplicated
    appProj.removeFramework(path.join(projName, 'Plugins', frameworkPluginName, frameworkName), { customFramework: true });

    //add the Embed Frameworks Build Phase to the project if it doesn't already exist
    if (appProj.pbxEmbedFrameworksBuildPhaseObj(appProj.getFirstTarget().uuid) == null) {
        appProj.addBuildPhase([], 'PBXCopyFilesBuildPhase', 'Embed Frameworks', appProj.getFirstTarget().uuid, 'frameworks');
    }

    //add the frameworks to the Embed Frameworks Build Phase
    appProj.addFramework(path.join(projName, 'Plugins', frameworkPluginName, frameworkName), { customFramework: true, embed: true, sign: true });
}

try {
    appProject.parseSync();

    console.log("Adding Gigya Framework to the Embedded Frameworks section of " + projName + " project.");
    embedFramework(appProject, 'cordova-plugin-gigya', 'GigyaSDK.framework');

    console.log("Adding Run Script build phase to the " + projName + " project.");
    addBuildPhase(appProject, 'Run Script', 'PBXShellScriptBuildPhase', {
        shellPath: '/bin/sh',
        shellScript: '../../scripts/ios/runscript.sh'
    });

    fs.writeFileSync(projectPath, appProject.writeSync());
    console.log("Finished adding build phases to the " + projName + " project.")
} catch (err) {
    throw console.log("Failed to modify the " + projName + " project:\n" + err);
}
